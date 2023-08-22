export default class Missile {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.launched = false;
    this.exploded = false;
  }

  launch(targetX, targetY) {
    if (!this.launched) {
      this.launched = true;
      this.targetX = targetX;
      this.targetY = targetY;
    }
  }

  move(targetX, targetY) {
    if (this.launched) {
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.speed) {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      } else {
        this.exploded = true;
      }
    }
  }
}