export default class Plane {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = 40;
  }

  moveTo(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    } else {
      this.x = targetX
      this.y = targetY
    }
  }

  draw(ctx, img) {
    const sz = this.size;
    ctx.drawImage(img, this.x - sz / 2, this.y - sz / 2, sz, sz);
  }
}