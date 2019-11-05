import { Vector } from "./Vector";
import { Game } from "./index";

export class Boid {
  public velocity: Vector = new Vector(5, 5);
  public position: Vector;
  private radius: number = 50;
  private speed: number = 3;

  private alignmentWeight: number = 1;
  private cohesionWeight: number = 1;
  private separationWeight: number = 3;
  private wallSeparationWeight: number = 5;

  constructor(x: number, y: number, protected game: Game) {
    this.position = new Vector(x, y);
  }

  wallSeparation(): Vector {
    const sep = 5;
    const distToVertWall = Math.min(
      Math.abs(this.game.canvas.width - this.position.x),
      this.position.x
    );
    const distToHoriWall = Math.min(
      Math.abs(this.game.canvas.height - this.position.y),
      this.position.y
    );
    if (distToVertWall < sep || distToHoriWall < sep) {
      return this.seek(
        new Vector(this.game.canvas.width / 2, this.game.canvas.height / 2)
      );
    }
    return new Vector(0, 0);
  }

  seek(target: Vector): Vector {
    return target.diff(this.position).normalize();
  }

  flock(boids: Boid[]) {
    const alignment = this.alignment(boids).mul(this.alignmentWeight);
    const cohesion = this.cohesion(boids).mul(this.cohesionWeight);
    const separation = this.separation(boids).mul(this.separationWeight);
    const wallSeparation = this.wallSeparation().mul(this.wallSeparationWeight);

    this.velocity
      .add(alignment)
      .add(cohesion)
      .add(separation)
      .add(wallSeparation);
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

    if (neighborCount === 0) {
      return v;
    }

    v.div(neighborCount);
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
