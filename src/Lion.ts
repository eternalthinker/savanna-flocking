import { PredatorBoid } from "./PredatorBoid";
import { Game } from "./Game";
import { Vector } from "./Vector";
import { PreyBoid } from "./PreyBoid";

export class Lion extends PredatorBoid {
  private readonly attackDamage = 1;

  constructor(x: number, y: number, game: Game) {
    super(x, y, game);

    const spriteSheet = this.game.sprites.lionSheet;
    this.width = spriteSheet.width / 6;
    this.height = spriteSheet.height;
    this.boundingRectWidth = this.width * 0.7;
    this.boundingRectHeight = this.height * 0.7;
    this.boundingRectCenter = new Vector(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    this.boundingRectColor = "#ff0000";

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
    this.boundingRectCenter = new Vector(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    this.draw(this.position.x, this.position.y);
  }

  attack(prey: PreyBoid) {
    // Attack animation
    prey.takeDamage(this.attackDamage);
  }
}
