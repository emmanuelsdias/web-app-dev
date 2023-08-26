export default class Particle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5 
    };
    this.lifespan = 60;
    this.end = false;
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.lifespan--;
    if (this.lifespan <= 0) {
      this.end = true;
    }
  }

  drawLight(ctx, img) {
    ctx.save();
    ctx.globalAlpha = this.lifespan / 60;
    ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
    ctx.restore();
  }

  drawObj(ctx) {
    const sz = this.size;
    ctx.save();
    ctx.globalAlpha = this.lifespan / 60;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - sz / 2, this.y - sz / 2, sz, sz); 
    ctx.restore();
  }

  update(lightCtx, light, objCtx) {
    this.move();
    this.drawLight(lightCtx, light);
    this.drawObj(objCtx);
  }
}
