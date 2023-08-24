export default class Missile {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = (Math.random() + 0.5) * speed;
    this.launched = false;
    this.targetHit = false;
    this.missileHit = false;
    this.angle = 0;
    this.size = 40;
  }

  launch(targetX, targetY) {
    if (!this.launched) {
      this.launched = true;
      this.targetX = targetX;
      this.targetY = targetY;
    }
  }

  avoidCollisions(missiles) {
    const separation = this.size / 2; 

    let repulsion = { x: 0, y: 0 };
    let total = 0;

    for (const other of missiles) {
      if (other !== this) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < separation) {
          repulsion.x += dx;
          repulsion.y += dy;
          total++;
          if (distance < this.size / 4) {
            this.missileHit = true;
            other.missileHit = true;
          }
        }
      }
    }

    if (total > 0) {
      const magnitude = Math.sqrt(repulsion.x * repulsion.x + repulsion.y * repulsion.y);
      if (magnitude > 0) {
        repulsion.x *= separation / magnitude;
        repulsion.y *= separation / magnitude;
      }
    }

    return repulsion;
  }

  move(targetX, targetY, missiles) {
    const separation = this.avoidCollisions(missiles);
    const dx = targetX - this.x + separation.x;
    const dy = targetY - this.y + separation.y;
    this.angle = Math.atan2(dy, dx);

    if (this.launched) {
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.size / 2) {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      } else {
        this.targetHit = true;
      }
    }
  }

  draw(ctx, img) {
    const sz = this.size;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
    ctx.restore();
  }
}