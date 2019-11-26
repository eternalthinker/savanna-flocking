import { Boid } from "./Boid";
import { Game } from "./index";
import { PredatorBoid } from "./PredatorBoid";

export abstract class PreyBoid extends Boid {
  protected fleeingWeight: number = 6;

  constructor(x: number, y: number, game: Game) {
    super(x, y, game);
  }

  fleeing(predators: PredatorBoid[]) {
    return this.separation(predators);
  }

  abstract takeDamage(damage: number): void;

  flockWithFlee(boids: Boid[], predators: PredatorBoid[]) {
    const alignment = this.alignment(boids).mul(this.alignmentWeight);
    const cohesion = this.cohesion(boids).mul(this.cohesionWeight);
    const separation = this.separation(boids).mul(this.separationWeight);
    const wallSeparation = this.wallSeparation().mul(this.wallSeparationWeight);
    const fleeing = this.fleeing(predators).mul(this.fleeingWeight);

    this.velocity
      .add(alignment)
      .add(cohesion)
      .add(separation)
      .add(wallSeparation)
      .add(fleeing);
    this.velocity.normalize();
    this.velocity.mul(this.speed);
    this.flipX = this.velocity.x < 0 ? false : true;
    this.position.add(this.velocity);
  }
}
