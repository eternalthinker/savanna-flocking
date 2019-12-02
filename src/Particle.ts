import { Game } from "./Game";
import { Vector } from "./Vector";
import { Drawable } from "./Drawable";
import { Perishable } from "./Perishable";

export class Particle {
  protected velocity: Vector = new Vector(
    Math.random() * 1 * (Math.random() < 0.5 ? 1 : -1),
    Math.random() * 1 * (Math.random() < 0.5 ? 1 : -1)
  );
  public life = 0;
  public isAlive = true;
  private maxLife = 10;
  private size: number;

  constructor(
    protected game: Game,
    private drawable: Drawable,
    public position: Vector
  ) {}

  draw() {
    this.position.add(this.velocity);
    this.velocity.y += this.game.gravity;
    this.life++;
    if (this.life <= this.maxLife) {
      this.drawable.draw(this.position.x, this.position.y);
    } else {
      this.isAlive = false;
      const _perishable = new Perishable(
        this.game,
        this.drawable,
        this.position,
        500,
        0.2
      );
    }
  }
}
