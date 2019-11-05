import { Boid } from "./Boid";
import { Game } from "./index";

export class Antelope extends Boid {
  private sprite: HTMLImageElement = this.game.sprites["antelope"];

  constructor(x: number, y: number, game: Game) {
    super(x, y, game);
  }

  draw() {
    this.game.ctx.drawImage(this.sprite, this.position.x, this.position.y);
  }
}
