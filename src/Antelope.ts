import { PreyBoid } from "./PreyBoid";
import { Game } from "./Game";
import { Vector } from "./Vector";
import { BloodParticleSystem } from "./BloodParticleSystem";

export class Antelope extends PreyBoid {
  private health = 100;
  private _isAlive = true;

  constructor(x: number, y: number, game: Game) {
    super(x, y, game);

    const spriteSheet = this.game.sprites.antelopeSheet;
    this.width = spriteSheet.width / 6;
    this.height = spriteSheet.height;
    this.boundingRectWidth = this.width * 0.7;
    this.boundingRectHeight = this.height * 0.7;
    this.boundingRectCenter = new Vector(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

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

  get isAlive(): boolean {
    return this._isAlive;
  }

  update() {
    this.boundingRectCenter = new Vector(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    this.draw(this.position.x, this.position.y);
  }

  takeDamage(damage: number) {
    if (this.game.showBlood) {
      const _blood = new BloodParticleSystem(
        this.game,
        new Vector(
          this.position.x + (Math.random() * this.width) / 2,
          this.position.y + (Math.random() * this.height) / 2
        )
      );
    }
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this._isAlive = false;
  }
}
