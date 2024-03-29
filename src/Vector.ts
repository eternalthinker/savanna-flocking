export class Vector {
  constructor(public x: number, public y: number) {}

  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(v: Vector): Vector {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector): Vector {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(n: number): Vector {
    this.x *= n;
    this.y *= n;
    return this;
  }

  div(n: number): Vector {
    this.x /= n;
    this.y /= n;
    return this;
  }

  normalize(): Vector {
    this.div(this.magnitude || 1);
    return this;
  }

  diff(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  dist(v: Vector): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
