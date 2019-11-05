import { Boid } from "./Boid";
import { Game } from "./index";

export class Antelope extends Boid {
  private game: Game = Game.getInstance();
  private sprite: HTMLImageElement = this.game.sprites["antelope"];

  constructor(x: number, y: number) {
    super(x, y);
  }

  draw() {
    this.game.ctx.drawImage(this.sprite, this.position.x, this.position.y);
  }
}
