export default class Plane {
  constructor(x, y, speed, target) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.target = {x: 0, y: 0};
    this.flipped = false;
    this.size = 40;
  }

  chase(target) {
    this.target = target;
  }

  move() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (dx < 0) {
      this.flipped = true;
    } else if (dx > 0) {
      this.flipped = false;
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
    if (this.flipped) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(img, -(this.x + sz / 2), this.y - sz / 2, sz, sz);
      ctx.restore();
    } else {
     ctx.drawImage(img, this.x - sz / 2, this.y - sz / 2, sz, sz);
    }
  }

  drawLight(ctx, img) {
    ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
  }

  update(lightCtx, light, objCtx, planeImage) {
    this.move();
    this.drawLight(lightCtx, light);
    this.drawObj(objCtx, planeImage);
  }
}