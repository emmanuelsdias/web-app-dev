export default class Missile {
  constructor(x, y, speed, target, scale) {
    this.x = x;
    this.y = y;
    this.speed = speed * (Math.random() + 0.5);
    this.repulsion = 0;
    this.angle = 0;
    this.size = 20 * scale;
    this.target = target;
    this.launched = false;
    this.targetHit = false;
    this.missileHit = false;
  }

  launch(target) {
    this.launched = true;
  }

  checkSurroundings(missiles) {
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

    this.repulsion = repulsion;
  }

  move() {
    const separation = this.repulsion;
    const dx = this.target.x - this.x + separation.x;
    const dy = this.target.y - this.y + separation.y;
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

  drawLight(ctx, img) {
    ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
  }

  drawObj(ctx, img) {
    const sz = this.size;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
    ctx.restore();
  }
  
  update(missiles, lightCtx, light, objCtx, missileImage) {
    this.checkSurroundings(missiles);
    if (!this.target.dying) {
      this.move();
    }
    this.drawLight(lightCtx, light);
    this.drawObj(objCtx, missileImage);
  }
}