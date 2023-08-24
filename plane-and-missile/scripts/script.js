import Plane from './plane.js';
import Missile from './missile.js';
import Particle from './particle.js';

//--- CANVAS ---//
const cnv = document.getElementById("canvas");
cnv.width = document.body.clientWidth;
cnv.height = document.body.clientHeight;
const ctx = cnv.getContext("2d");

let cursorX = cnv.width / 2;
let cursorY = cnv.height / 2;


//--- INITIALIZATION ---//
const planeImage   = new Image();
const missileImage = new Image();
const bgImage      = new Image();
planeImage.src   = "./assets/images/plane.png";
missileImage.src = "./assets/images/missile.png";
bgImage.src      = "./assets/images/dummy_bg.png"

let startMissileX = cnv.width / 2;
let startMissileY = cnv.height - 40;
let missileSpeed = Math.max(cnv.width, cnv.height) / 200;
let planeSpeed = 2 * missileSpeed;

const plane = new Plane(cursorX, cursorY, planeSpeed);
const particles = [];
const missiles = [];
missiles.push(new Missile(startMissileX, startMissileY, missileSpeed));

//--- SOUND FUNCTIONS ---///
let soundEnabled = true;

var missileLaunchSound  = document.getElementById("missileLaunchSound");
var missileExplodeSound = document.getElementById("missileExplodeSound");
var planeExplodeSound   = document.getElementById("planeExplodeSound");

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
cnv.addEventListener("touchmove", (e) => {
  var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
  var touch = evt.touches[0] || evt.changedTouches[0];
  cursorX = touch.pageX;
  cursorY = touch.pageY;
});

cnv.addEventListener("mousemove", (e) => {
  cursorX = e.clientX
  cursorY = e.clientY
});

let recentLaunch = false;
// Left-click instead of right-click
cnv.addEventListener("click", async (e) => {
  if (!recentLaunch) {
    recentLaunch = true;
    missiles[missiles.length - 1].launch(plane.x, plane.y);
    playMissileLaunchSound();
    await new Promise(r => setTimeout(r, 200));
    missiles.push(new Missile(startMissileX, startMissileY, missileSpeed));
    recentLaunch = false;
  }
});

// // Right-click instead of left-click
// cnv.addEventListener("contextmenu", (e) => {
// e.preventDefault();
// missiles[missiles.length - 1].launch(plane.x, plane.y);
// missiles.push(new Missile(startMissileX, startMissileY, missileSpeed));
// playMissileLaunchSound();
// return false;
// });


//--- LIGHTS ---///
function makeCircleLight(r) {
  const lightCnv = document.createElement("canvas");
  lightCnv.width = 2 * r;
  lightCnv.height = 2 * r;
  const lightCtx = lightCnv.getContext("2d");

  const grd = lightCtx.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0.2, "rgba(255, 255, 255, 1.0)");
  grd.addColorStop(0.7, "rgba(255, 255, 255, 0.3)");
  grd.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  lightCtx.fillStyle = grd;
  lightCtx.fillRect(0, 0, 2 * r, 2 * r);

  return lightCnv;
}

const tinyLight = makeCircleLight(20);
const smallLight = makeCircleLight(50);
const largeLight = makeCircleLight(100);

function drawLights() {
  // Cover with shadow
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add lights
  ctx.drawImage(largeLight, plane.x - 100, plane.y - 100);
  for (const missile of missiles) {
    ctx.drawImage(smallLight, missile.x - 50, missile.y - 50);
  }
  ctx.save();
  for (const particle of particles) {
    ctx.globalAlpha = particle.lifespan / 60;
    ctx.drawImage(tinyLight, particle.x - 20, particle.y - 20);
  }
  ctx.restore();

  // Add background
  // ctx.globalCompositeOperation = "multiply";
  // ctx.drawImage(bgImage, 0, 0)

  // Reset composite operator
  ctx.globalCompositeOperation = "source-over";
}


//--- MAIN LOOP ---///
function animate() {
  // Reset canvas
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move stuff
  plane.moveTo(cursorX, cursorY);
  for (const missile of missiles) {
    if (missile.missileHit) {
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(missile.x, missile.y, "white"));
      }  
      playMissileExplodeSound();
      missiles.splice(missiles.indexOf(missile), 1);
    } else if (missile.targetHit) {
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(plane.x, plane.y, "red"));
      }
      playPlaneExplodeSound();
      missiles.splice(missiles.indexOf(missile), 1);  
    } else {
      missile.move(plane.x, plane.y, missiles);
    }
  }
  for (const particle of particles) {
    particle.move();
    if (particle.end) {
      particles.splice(particles.indexOf(particle), 1);
    }
  }


  // Draw stuff
  drawLights();
  for (const particle of particles) {
    particle.draw(ctx);
  }
  for (const missile of missiles) {
    missile.draw(ctx, missileImage);
  }
  plane.draw(ctx, planeImage);

  // Loop animation
  requestAnimationFrame(animate);
}

// Wait for images to load before starting animation
Promise.all([
  new Promise((resolve) => (planeImage.onload = resolve)),
  new Promise((resolve) => (missileImage.onload = resolve)),
  new Promise((resolve) => (bgImage.onload = resolve))
]).then(() => {
  animate(); // Start animation loop after images are loaded
});