export default class Plane {
  constructor(x, y, speed, scale) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = 0;
    this.size = 20 * scale;
    this.target = {x: 0, y: 0};
    this.dying = false;
    this.deathTimer = 100;
  }

  chase(target) {
    this.target = target;
  }

  updateSpeed(speed) {
    this.speed = speed;
  }

  die() {
    this.dying = true;
  }

  deathAnimationEnded() {
    if (this.deathTimer > 0) {
      return false;
    }
    return true;
  }

  move() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      this.angle = Math.atan2(dy, dx);
    }

    if (distance > this.speed) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    } else {
      this.x = this.target.x
      this.y = this.target.y
    }
  }

  drawObj(ctx, img) {
    const sz = this.size;
    ctx.save();
    ctx.globalAlpha = this.deathTimer / 100;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
    ctx.restore();
  }

  drawLight(ctx, img) {
    ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
  }

  update(lightCtx, light, objCtx, planeImage) {
    if (!this.dying) {
      this.move();
    }
    else {
      this.angle += Math.PI / 60;
      this.deathTimer -= 1;
    }
    this.drawLight(lightCtx, light);
    this.drawObj(objCtx, planeImage);
  }
}