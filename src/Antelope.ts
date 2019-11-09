import { PreyBoid } from "./PreyBoid";
import { Game } from "./index";

export class Antelope extends PreyBoid {
  constructor(x: number, y: number, game: Game) {
    super(x, y, game);
    this.addAnimation("run", {
      spriteSheet: this.game.sprites.antelopeSheet,
      row: 0,
      frameCount: 6,
      frameDuration: 100
    });
    this.addAnimation("run_flipX", {
      spriteSheet: this.game.sprites.antelopeSheet_flipX,
      row: 0,
      frameCount: 6,
      frameDuration: 100
    });
    this.currentFrame = Math.floor(Math.random() * 6);
  }

  update() {
    this.draw(this.position.x, this.position.y);
  }
}
