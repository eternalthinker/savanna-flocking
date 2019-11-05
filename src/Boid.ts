import { Vector } from "./Vector";

export class Boid {
  public velocity: Vector = new Vector(5, 5);
  public position: Vector;
  private radius: number = 50;
  private speed: number = 3;

  private alignmentWeight: number = 1;
  private cohesionWeight: number = 1;
  private separationWeight: number = 3;

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  flock(boids: Boid[]) {
    const alignment = this.alignment(boids).mul(this.alignmentWeight);
    const cohesion = this.cohesion(boids).mul(this.cohesionWeight);
    const separation = this.separation(boids).mul(this.separationWeight);

    this.velocity
      .add(alignment)
      .add(cohesion)
      .add(separation);
    this.velocity.normalize();
    this.velocity.mul(this.speed);
    this.position.add(this.velocity);
  }

  alignment(boids: Boid[]): Vector {
    let neighborCount: number = 0;
    let v: Vector = new Vector(0, 0);
    boids.forEach(boid => {
      if (boid === this) {
        return;
      }

      if (this.position.dist(boid.position) < this.radius) {
        v.add(boid.velocity);
        neighborCount++;
      }
    });

    v.div(neighborCount || 1);
    v.normalize();
    return v;
  }

  cohesion(boids: Boid[]): Vector {
    let neighborCount: number = 0;
    let v: Vector = new Vector(0, 0);
    boids.forEach(boid => {
      if (boid === this) {
        return;
      }

      if (this.position.dist(boid.position) < this.radius) {
        v.add(boid.position);
        neighborCount++;
      }
    });

    v.div(neighborCount || 1);
    const vCoh = v.diff(this.position);

    vCoh.normalize();
    return vCoh;
  }

  separation(boids: Boid[]): Vector {
    let neighborCount: number = 0;
    let v: Vector = new Vector(0, 0);
    boids.forEach(boid => {
      if (boid === this) {
        return;
      }

      if (this.position.dist(boid.position) < this.radius) {
        v.add(boid.position.diff(this.position));
        neighborCount++;
      }
    });

    v.div(neighborCount || 1);
    v.mul(-1);
    v.normalize();
    return v;
  }
}
