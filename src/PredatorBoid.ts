import { Boid } from "./Boid";
import { Game } from "./Game";
import { PreyBoid } from "./PreyBoid";

export abstract class PredatorBoid extends Boid {
  protected chasingWeight: number = 3;

  constructor(x: number, y: number, game: Game) {
    super(x, y, game);
  }

  chasing(preys: PreyBoid[]) {
    preys.forEach(prey => {
      if (this.collidesWith(prey)) {
        this.attack(prey);
      }
    });

    return this.cohesion(preys);
  }

  abstract attack(prey: PreyBoid): void;

  flockWithChase(boids: Boid[], preys: PreyBoid[]) {
    const alignment = this.alignment(boids).mul(this.alignmentWeight);
    const cohesion = this.cohesion(boids).mul(this.cohesionWeight);
    const separation = this.separation(boids).mul(this.separationWeight);
    const wallSeparation = this.wallSeparation().mul(this.wallSeparationWeight);
    const chasing = this.chasing(preys).mul(this.chasingWeight);

    this.velocity
      .add(alignment)
      .add(cohesion)
      .add(separation)
      .add(wallSeparation)
      .add(chasing);
    this.velocity.normalize();
    this.velocity.mul(this.speed);
    this.flipX = this.velocity.x < 0 ? false : true;
    this.position.add(this.velocity);
  }
}
