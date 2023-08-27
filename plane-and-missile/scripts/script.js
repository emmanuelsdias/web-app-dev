import Plane from './plane.js';
import Missile from './missile.js';
import Particle from './particle.js';
import { makeCircleLight } from './lights.js';

//--- COLORS ---//
var COLORS = {
  RED:    "#EB501D",
  BLUE:   "#1178BD",
  YELLOW: "#FEC570",
  WHITE:  "#F0F0F0",
  GRAY:   "#BDC9D7",
  BLACK:  "#3B3B3B"
};


//--- CANVASES ---//
const cnv = document.getElementById("canvas");
const ctx = cnv.getContext("2d");

const lightCnv = document.createElement("canvas");
const lightCtx = lightCnv.getContext("2d");

const bgCnv = document.createElement("canvas");
const bgCtx = bgCnv.getContext("2d");

const objCnv = document.createElement("canvas");
const objCtx = objCnv.getContext("2d");

function resizeCanvases() {
  cnv.width = innerWidth;
  cnv.height = innerHeight;
  ctx.imageSmoothingEnabled = false;

  lightCnv.width = cnv.width;
  lightCnv.height = cnv.height;

  bgCnv.width = cnv.width;
  bgCnv.height = cnv.height;
  bgCtx.imageSmoothingEnabled = false;

  objCnv.width = cnv.width;
  objCnv.height = cnv.height;
  objCtx.imageSmoothingEnabled = false;
}

function overlayCanvases() {
  ctx.drawImage(lightCnv, 0, 0);
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(bgCnv, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(objCnv, 0, 0);
}

function clearCanvases() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  lightCtx.clearRect(0, 0, cnv.width, cnv.height);
  lightCtx.fillStyle = COLORS.BLACK;
  lightCtx.fillRect(0, 0, cnv.width, cnv.height)
  objCtx.clearRect(0, 0, cnv.width, cnv.height);
}

resizeCanvases();


//--- SCALING BASED ON VIBES ---//
let scaling;

function updateIdealScaling() {
  let vibes = Math.min(cnv.width, cnv.height) / 200;
  if (vibes > 4) {
    scaling = 3;
  } else if (vibes > 2) {
    scaling = 2;
  } else {
    scaling = 1;
  }
}
updateIdealScaling();


//--- ASSETS ---//
const planeImage   = new Image();
const missileImage = new Image();
const bgImage      = new Image();
const muteImage    = new Image();
const unmuteImage  = new Image();
planeImage.src   = "./assets/images/plane.png";
missileImage.src = "./assets/images/missile.png";
bgImage.src      = "./assets/images/background.png";
muteImage.src    = "./assets/images/mute.png";
unmuteImage.src  = "./assets/images/unmute.png";

function updateTextStyle() {
  objCtx.font = `${20 * scaling}px PixelFont, sans-serif`;
  objCtx.fillStyle = COLORS.WHITE;
  objCtx.textAlign = "center";
  objCtx.textBaseline = "top";
}
updateTextStyle();

function drawImageScaled() {
  const canvas = bgCtx.canvas;
  const hRatio = canvas.width / bgImage.width;
  const vRatio = canvas.height / bgImage.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShiftX = (canvas.width - bgImage.width * ratio) / 2;
  const centerShiftY = (canvas.height - bgImage.height * ratio) / 2;
  bgCtx.drawImage(bgImage,
    0, 0,
    bgImage.width, bgImage.height,
    centerShiftX, centerShiftY,
    bgImage.width * ratio, bgImage.height * ratio
  );
}


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
  drawImageScaled();
  updateIdealScaling();
  updateTextStyle();
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

let newGameWaiting = true;
let planeDyingAnimation;
let recentLaunch;
// Left-click instead of right-click
cnv.addEventListener("click", async (e) => {
  if (newGameWaiting) {
    newGame();
    newGameWaiting = false;
  } else if ( mouse.x >= cnv.width - 20 * (1 + scaling)
           && mouse.x <= cnv.width - 20
           && mouse.y >= cnv.height - 20 * (1 + scaling)
           && mouse.y <= cnv.height - 20) {
    soundEnabled = !soundEnabled;
  } else if (!recentLaunch && !planeDyingAnimation) {
    recentLaunch = true;
    if (missiles.length > 0) {
      missiles[missiles.length - 1].launch(plane);
    }
    playMissileLaunchSound();
    await new Promise(r => setTimeout(r, 200));
    missiles.push(new Missile(startMissileX, startMissileY, missileSpeed, plane, scaling));
    recentLaunch = false;
  }
});


//--- LIGHTS ---///
const tinyLight = makeCircleLight(6 * scaling);
const smallLight = makeCircleLight(20 * (1 + scaling));
const largeLight = makeCircleLight(20 * (2 + scaling));


//--- GAME OBJECTS AND FUNCTIONS ---//
let plane;
let particles;
let missiles;
let score;

function displayNewGameScreen() {
  objCtx.textBaseline = "middle";
  objCtx.fillText("NEW GAME!", cnv.width / 2, cnv.height / 2 - 20 * scaling);
  objCtx.fillText("CLICK OR TAP", cnv.width / 2, cnv.height / 2);
  objCtx.fillText("TO BEGIN", cnv.width / 2, cnv.height / 2 + 20 * scaling);

  if (typeof score !== "undefined" && score !== null) {
    objCtx.textBaseline = "bottom";
    objCtx.fillText(`LAST SCORE: ${score}`, cnv.width / 2, cnv.height - 20);
  }
}

function newGame() {
  score = 0;
  plane = new Plane(mouse.x, mouse.y, planeSpeed, scaling);
  plane.chase(mouse);
  planeDyingAnimation = false;
  particles = [];
  missiles = [];
  missiles.push(new Missile(startMissileX, startMissileY, missileSpeed, plane, scaling));
}

function explode(target, color) {
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(target.x, target.y, 2 * scaling, color));
  }
}

function updateMuteButton() {
  const displayedImage = soundEnabled ? unmuteImage : muteImage;
  objCtx.drawImage(displayedImage, cnv.width - 20 * (1 + scaling), cnv.height - 20 * (1 + scaling), 20 * scaling, 20 * scaling);
}

function updateScore() {
  for (const missile of missiles) {
    if (missile.missileHit) {
      score += 1;
    }
  }
  objCtx.textBaseline = "top";
  objCtx.fillText(`SCORE: ${score}`, cnv.width / 2, 20);
}


//--- GAME PARAMETERS ---//
let startMissileX;
let startMissileY;
let missileSpeed;
let planeSpeed;

function resetParameters() {
  startMissileX = cnv.width / 2;
  startMissileY = cnv.height - 20 * scaling;
  missileSpeed = Math.max(cnv.width, cnv.height) / 200;
  planeSpeed = 2 * missileSpeed;
  if (typeof plane !== "undefined" && plane !== null) {
    plane.updateSpeed(planeSpeed);
  }
}

resetParameters();


//--- MAIN LOOP ---///
function animate() {
  // Clear canvas
  clearCanvases();

  if (newGameWaiting) {
    displayNewGameScreen();
  } else {
    // Update objects
    for (const particle of particles) {
      particle.update(lightCtx, tinyLight, objCtx);
    }
    for (const missile of missiles) {
      missile.update(missiles, lightCtx, smallLight, objCtx, missileImage);
      if (missile.missileHit) {
        playMissileExplodeSound();
        explode(missile, COLORS.WHITE);
      } else if (missile.targetHit) {
        plane.die();
        planeDyingAnimation = true;
        playPlaneExplodeSound();
        explode(plane, COLORS.WHITE);
        explode(plane, COLORS.YELLOW);
        explode(plane, COLORS.BLUE);
        explode(plane, COLORS.RED);
      }
    }
    plane.update(lightCtx, largeLight, objCtx, planeImage);

    // Update UI
    updateMuteButton();
    updateScore();

    // Remove old missiles and particles
    missiles = missiles.filter(missile => !missile.missileHit && !missile.targetHit);
    particles = particles.filter(particle => !particle.end);

    // Check end game
    if (plane.deathAnimationEnded()) {
      newGameWaiting = true;
    }
  }

  // Overlay canvases
  overlayCanvases();

  // Loop animation
  requestAnimationFrame(animate);
}

// Wait for images to load before starting animation
Promise.all([
  new Promise((resolve) => (planeImage.onload = resolve)),
  new Promise((resolve) => (missileImage.onload = resolve)),
  new Promise((resolve) => (bgImage.onload = resolve))
]).then(() => {
  drawImageScaled();
  animate(); // Start animation loop after images are loaded
});