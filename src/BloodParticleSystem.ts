import { Particle } from "./Particle";
import { Vector } from "./Vector";
import { Game } from "./index";
import { Updatable } from "./Updatable";

export class BloodParticleSystem extends Updatable {
  private particles: Particle[] = [];

  constructor(
    private readonly game: Game,
    private readonly origin: Vector,
    private readonly particleCount: number = 5
  ) {
    super();
    this.init();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = new Particle(this.game, this.origin);
      this.particles.push(particle);
    }
    this.game.registerUpdatable(this);
  }

  update() {
    this.particles = this.particles.filter(particle => particle.isAlive);
    if (this.particles.length === 0) {
      this.game.deregisterUpdatable(this);
      return;
    }
    this.particles.forEach(particle => particle.draw());
  }
}
