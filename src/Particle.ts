import { Game } from "./index";
import { Vector } from "./Vector";

export class Particle {
  protected velocity: Vector = new Vector(
    Math.random() * 1 * (Math.random() < 0.5 ? 1 : -1),
    Math.random() * 1 * (Math.random() < 0.5 ? 1 : -1)
  );
  public life = 0;
  public isAlive = true;
  private maxLife = 10;
  private size: number;

  constructor(protected game: Game, public position: Vector) {
    const antelopeSheet = this.game.sprites.antelopeSheet;
    this.size = antelopeSheet.height / 13;
  }

  draw() {
    this.position.add(this.velocity);
    this.velocity.y += this.game.gravity;
    this.life++;
    if (this.life <= this.maxLife) {
      this.render();
    } else {
      this.isAlive = false;
    }
  }

  render() {
    const ctx = this.game.ctx;

    ctx.strokeStyle = null;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size, this.size);
    ctx.fill();
  }
}
