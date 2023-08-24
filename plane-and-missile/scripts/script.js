import Plane from './plane.js';
import Missile from './missile.js';
import Particle from './particle.js';
import { drawLights } from './lights.js';

//--- CANVAS ---//
const cnv = document.getElementById("canvas");
const ctx = cnv.getContext("2d");
cnv.width = innerWidth;
cnv.height = innerHeight;

ctx.imageSmoothingEnabled = false;

//--- INITIALIZATION ---//
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const planeImage   = new Image();
const missileImage = new Image();
const bgImage      = new Image();
planeImage.src   = "./assets/images/plane.png";
missileImage.src = "./assets/images/missile.png";
bgImage.src      = "./assets/images/dummy_bg.png";

let startMissileX;
let startMissileY;
let missileSpeed;
let planeSpeed;

function reset () {
  startMissileX = cnv.width / 2;
  startMissileY = cnv.height - 40;
  missileSpeed = Math.max(cnv.width, cnv.height) / 200;
  planeSpeed = 2 * missileSpeed;
}

reset();

let plane;
let particles;
let missiles;

plane = new Plane(mouse.x, mouse.y, planeSpeed);
plane.chase(mouse);
particles = [];
missiles = [];
missiles.push(new Missile(startMissileX, startMissileY, missileSpeed, plane));


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
addEventListener('resize', () => {
  cnv.width = document.body.clientWidth;
  cnv.height = document.body.clientHeight;
  reset();
});

cnv.addEventListener("touchmove", (e) => {
  var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
  var touch = evt.touches[0] || evt.changedTouches[0];
  mouse.x = touch.pageX;
  mouse.y = touch.pageY;
});

cnv.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
});

let recentLaunch = false;
// Left-click instead of right-click
cnv.addEventListener("click", async (e) => {
  if (!recentLaunch) {
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


//--- MAIN LOOP ---///
function explode(target, color) {
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(target.x, target.y, color));
  }
}

function drawBackground(ctx, img) {
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(img, 0, 0)
  ctx.globalCompositeOperation = "source-over";
};

function animate() {
  // Reset canvas
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // Update positions and statuses
  plane.move();
  for (const missile of missiles) {
    missile.checkSurroundings(missiles);
    missile.move();
    if (missile.missileHit) {
      playMissileExplodeSound();
      explode(missile, "white");
    } else if (missile.targetHit) {
      playPlaneExplodeSound();
      explode(plane, "red");
    } 
  }
  for (const particle of particles) {
    particle.move();
  }

  // Draw on canvas
  drawLights(ctx, plane, missiles, particles);
  drawBackground(ctx, bgImage);
  for (const p of particles) { p.draw(ctx, missileImage); };
  for (const m of missiles) { m.draw(ctx, missileImage); }
  plane.draw(ctx, planeImage);

  // Remove old missiles and particles
  missiles = missiles.filter(missile => !missile.missileHit && !missile.targetHit);
  particles = particles.filter(particle => !particle.end);

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