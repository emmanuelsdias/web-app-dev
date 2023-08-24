export function makeCircleLight(r) {
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
