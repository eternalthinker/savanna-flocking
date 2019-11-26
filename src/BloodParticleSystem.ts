import { BloodDrawable } from "./BloodDrawable";
import { Particle } from "./Particle";
import { Vector } from "./Vector";
import { Game } from "./Game";
import { Updatable } from "./Updatable";
import { Perishable } from "./Perishable";

export class BloodParticleSystem implements Updatable {
  private particles: Particle[] = [];

  constructor(
    private readonly game: Game,
    private readonly origin: Vector,
    private readonly particleCount: number = 5
  ) {
    this.init();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      const bloodDrawable = new BloodDrawable(this.game);
      const particle = new Particle(this.game, bloodDrawable, this.origin);
      this.particles.push(particle);
    }
    this.game.registerUpdatable(this, "foreground");
  }

  update() {
    this.particles = this.particles.filter(particle => particle.isAlive);
    if (this.particles.length === 0) {
      this.game.deregisterUpdatable(this, "foreground");
      return;
    }
    this.particles.forEach(particle => particle.draw());
  }
}
