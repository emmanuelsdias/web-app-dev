import Plane from './plane.js';
import Missile from './missile.js';

const canvas = document.getElementById("canvas");
canvas.width  = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const ctx = canvas.getContext("2d");

const planeImage = new Image();
planeImage.src = "./assets/images/plane.png";

const missileImage = new Image();
missileImage.src = "./assets/images/missile.png";

var launchSound = new Audio('./assets/sounds/explosion.wav')
var explosionSound = new Audio('./assets/sounds/launch.wav')

let cursorX = canvas.width / 2;
let cursorY = canvas.height / 2;
let planeSpeed = 15;
let missileX = canvas.width / 2;
let missileY = canvas.height - 40;
let missileSpeed = 10; // Adjust the speed as needed
let soundEnabled = true;

const plane = new Plane(cursorX, cursorY, planeSpeed);
const missiles = [];
missiles.push(new Missile(missileX, missileY, missileSpeed));

canvas.addEventListener("mousemove", (e) => {
  cursorX = e.clientX
  cursorY = e.clientY
});

canvas.addEventListener("click", () => {
  missiles[missiles.length - 1].launch(plane.x, plane.y);
  missiles.push(new Missile(missileX, missileY, missileSpeed));
  playMissileLaunchSound();
});

function draw() {
  canvas.width  = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const missile of missiles) {
    if (missile.exploded){
      playExplosionSound();
      missiles.splice(missiles.indexOf(missile), 1);
    } else if (missile.launched) {
      missile.move(plane.x, plane.y);
    }
    const dx = plane.x - missile.x;
    const dy = plane.y - missile.y;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(missile.x, missile.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(missileImage, -20, -20, 40, 40);
    ctx.restore();
  }

  plane.moveTo(cursorX, cursorY);
  ctx.drawImage(planeImage, plane.x - 20, plane.y - 20, 40, 40);

  requestAnimationFrame(draw);
}

function playMissileLaunchSound() {
  if (soundEnabled) {
    launchSound.currentTime = 0;
    launchSound.play();
  }
}

function playExplosionSound() {
  if (soundEnabled) {
    explosionSound.currentTime = 0;
    explosionSound.play();
  }
}

// Wait for images to load before starting animation
Promise.all([
  new Promise((resolve) => (planeImage.onload = resolve)),
  new Promise((resolve) => (missileImage.onload = resolve))
]).then(() => {
  draw(); // Start animation loop after images are loaded
});
