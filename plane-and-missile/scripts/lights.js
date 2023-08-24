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

export function drawLights(ctx, plane, missiles, particles) {
  // Cover with shadow
  ctx.fillStyle = "rgb(100, 100, 100)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

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
}