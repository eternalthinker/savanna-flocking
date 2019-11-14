import { PredatorBoid } from "./PredatorBoid";
import { Game } from "./index";

export class Lion extends PredatorBoid {
  constructor(x: number, y: number, game: Game) {
    super(x, y, game);
    this.speed = 1.5;
    this.radius = 100;
    this.addAnimation("run", {
      spriteSheet: this.game.sprites.lionSheet,
      row: 0,
      frameCount: 6,
      frameDuration: 70
    });
    this.addAnimation("run_flipX", {
      spriteSheet: this.game.sprites.lionSheet_flipX,
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
