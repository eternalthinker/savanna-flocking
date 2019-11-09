import { PredatorBoid } from "./PredatorBoid";
import { Game } from "./index";

export class Lion extends PredatorBoid {
  private sprite: CanvasImageSource = this.game.sprites["lion"];

  constructor(x: number, y: number, game: Game) {
    super(x, y, game);
    this.speed = 1.5;
    this.radius = 100;
  }

  draw() {
    this.game.ctx.drawImage(this.sprite, this.position.x, this.position.y);
  }
}
