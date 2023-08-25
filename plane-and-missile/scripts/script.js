import Plane from './plane.js';
import Missile from './missile.js';
import Particle from './particle.js';
import { makeCircleLight } from './lights.js';

//--- CANVASES ---//
const cnv = document.getElementById("canvas");
const ctx = cnv.getContext("2d");

const lightCnv = document.createElement("canvas");
const lightCtx = lightCnv.getContext("2d");

const objCnv = document.createElement("canvas");
const objCtx = objCnv.getContext("2d");

ctx.imageSmoothingEnabled = false;

function resizeCanvases() {
  cnv.width = innerWidth;
  cnv.height = innerHeight;
  
  lightCnv.width = cnv.width;
  lightCnv.height = cnv.height;

  objCnv.width = cnv.width;
  objCnv.height = cnv.height;
  objCtx.imageSmoothingEnabled = false;
}

function overlayCanvases() {
  ctx.drawImage(lightCnv, 0, 0);
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(bgImage, 0, 0)
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(objCnv, 0, 0);
}

function clearCanvases() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  lightCtx.clearRect(0, 0, cnv.width, cnv.height);
  lightCtx.fillStyle = "rgb(100, 100, 100)";
  lightCtx.fillRect(0, 0, cnv.width, cnv.height)
  objCtx.clearRect(0, 0, cnv.width, cnv.height);
}

resizeCanvases();


//--- ASSETS ---//
const planeImage   = new Image();
const missileImage = new Image();
const bgImage      = new Image();
const muteImage    = new Image();
const unmuteImage  = new Image();
planeImage.src   = "./assets/images/plane.png";
missileImage.src = "./assets/images/missile.png";
bgImage.src      = "./assets/images/dummy_bg.png";
muteImage.src    = "./assets/images/mute.png";
unmuteImage.src  = "./assets/images/unmute.png";

ctx.font = "24px PixelFont, sans-serif";
ctx.fillStyle = "white";
ctx.textAlign = "center";

//--- SOUND FUNCTIONS ---///
let soundEnabled = true;

const missileLaunchSound  = document.getElementById("missileLaunchSound");
const missileExplodeSound = document.getElementById("missileExplodeSound");
const planeExplodeSound   = document.getElementById("planeExplodeSound");

function playMissileLaunchSound() {
  if (soundEnabled) {
    missileLaunchSound.currentTime = 0;
    missileLaunchSound.play();
  }
}

function playMissileExplodeSound() {
  if (soundEnabled) {
    missileExplodeSound.currentTime = 0;
    missileExplodeSound.play();
  }
}

function playPlaneExplodeSound() {
  if (soundEnabled) {
    planeExplodeSound.currentTime = 1;
    planeExplodeSound.play();
  }
}


//--- LISTENERS ---///
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

addEventListener('resize', () => {
  resizeCanvases();
  resetParameters();
});

cnv.addEventListener("touchmove", (e) => {
  let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
  let touch = evt.touches[0] || evt.changedTouches[0];
  mouse.x = touch.pageX;
  mouse.y = touch.pageY;
});

cnv.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
});

let recentLaunch;
// Left-click instead of right-click
cnv.addEventListener("click", async (e) => {
  if (mouse.x >= 10 && mouse.x <= 70 && mouse.y >= 10 && mouse.y <= 70) {
    soundEnabled = !soundEnabled;

  } else if (!recentLaunch) {
    recentLaunch = true;
    missiles[missiles.length - 1].launch(plane);
    playMissileLaunchSound();
    await new Promise(r => setTimeout(r, 200));
    missiles.push(new Missile(startMissileX, startMissileY, missileSpeed, plane));
    recentLaunch = false;
  }
});

// // Right-click instead of left-click
// cnv.addEventListener("contextmenu", (e) => {
// e.preventDefault();
// missiles[missiles.length - 1].launch(plane.x, plane.y);
// missiles.push(new Missile(startMissileX, startMissileY, missileSpeed, plane));
// playMissileLaunchSound();
// return false;
// });


//--- LIGHTS ---///
const tinyLight = makeCircleLight(20);
const smallLight = makeCircleLight(50);
const largeLight = makeCircleLight(100);


//--- GAME PARAMETERS ---//
let startMissileX;
let startMissileY;
let missileSpeed;
let planeSpeed;

function resetParameters() {
  startMissileX = cnv.width / 2;
  startMissileY = cnv.height - 40;
  missileSpeed = Math.max(cnv.width, cnv.height) / 200;
  planeSpeed = 2 * missileSpeed;
}

resetParameters();


//--- GAME OBJECTS AND FUNCTIONS ---//
let plane;
let particles;
let missiles;
let score;

function newGame() {
  score = 0;
  plane = new Plane(mouse.x, mouse.y, planeSpeed);
  plane.chase(mouse);
  particles = [];
  missiles = [];
  missiles.push(new Missile(startMissileX, startMissileY, missileSpeed, plane));
}

function explode(target, color) {
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(target.x, target.y, color));
  }
}

function updateScore() {
  for (const missile of missiles) {
    if (missile.missileHit) {
      score += 1;
    }
  }
  ctx.fillText(`SCORE: ${score}`, cnv.width / 2, 40);
}


//--- MAIN LOOP ---///
function animate() {
  // Clear canvas
  clearCanvases();
  
  // Update objects
  for (const particle of particles) {
    particle.update(lightCtx, tinyLight, objCtx);
  }
  for (const missile of missiles) {
    missile.update(missiles, lightCtx, smallLight, objCtx, missileImage);
    if (missile.missileHit) {
      playMissileExplodeSound();
      explode(missile, "white");
    } else if (missile.targetHit) {
      playPlaneExplodeSound();
      explode(plane, "red");
    } 
  }
  plane.update(lightCtx, largeLight, objCtx, planeImage);

  // Overlay canvases
  overlayCanvases();

  // Update UI
  ctx.drawImage(soundEnabled ? unmuteImage : muteImage, 10, 10, 60, 60);
  updateScore();
  
  // Remove old missiles and particles
  missiles = missiles.filter(missile => !missile.missileHit && !missile.targetHit);
  particles = particles.filter(particle => !particle.end);

  // Loop animation
  requestAnimationFrame(animate);
}

newGame();

// Wait for images to load before starting animation
Promise.all([
  new Promise((resolve) => (planeImage.onload = resolve)),
  new Promise((resolve) => (missileImage.onload = resolve)),
  new Promise((resolve) => (bgImage.onload = resolve))
]).then(() => {
  animate(); // Start animation loop after images are loaded
});