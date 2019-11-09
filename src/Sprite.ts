import { Game } from "./index";

export type Animation = {
  spriteSheet: HTMLImageElement | HTMLCanvasElement;
  row: number;
  frameCount: number;
  frameDuration: number;
  width?: number;
  height?: number;
};

export class Sprite {
  private _flipX: boolean = false;
  protected loop: boolean = true;
  protected currentAnimation: string;
  protected currentFrame: number = 0;
  protected animations: { [key: string]: Animation } = {};
  private accTimeDelta: number = 0;
  private playing: boolean = true;
  private lastUpdateTime = Date.now();

  constructor(protected game: Game) {}

  addAnimation(name: string, animation: Animation) {
    animation.height = animation.spriteSheet.height;
    animation.width = animation.spriteSheet.width / animation.frameCount;
    this.animations[name] = animation;
    if (this.currentAnimation == null) {
      this.setAnimation(name);
    }
  }

  get isAnimationPlaying() {
    return this.playing;
  }

  set flipX(flipX: boolean) {
    if (!this._flipX && flipX) {
      this.setAnimation(`${this.currentAnimation}_flipX`);
    } else if (this._flipX && !flipX) {
      this.setAnimation(this.currentAnimation.replace("_flipX", ""));
    }
    this._flipX = flipX;
  }

  setAnimation(name: string, resetFrame = false) {
    this.currentAnimation = name;
    if (resetFrame) {
      this.currentFrame = 0;
    }
    this.playing = true;
  }

  draw(x: number, y: number) {
    const timeDelta = Date.now() - this.lastUpdateTime;
    this.accTimeDelta += timeDelta;

    this.render(x, y);
    const anim = this.animations[this.currentAnimation];
    if (this.accTimeDelta > anim.frameDuration) {
      this.accTimeDelta = 0;
      if (!this.playing) {
        return;
      }
      this.currentFrame++;
      if (this.currentFrame === anim.frameCount) {
        this.currentFrame = 0;
        if (!this.loop) {
          this.playing = false;
        }
      }
    }

    this.lastUpdateTime = Date.now();
  }

  render(x: number, y: number) {
    const ctx = this.game.ctx;

    const anim = this.animations[this.currentAnimation];
    if (this.flipX) {
      ctx.translate(anim.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      anim.spriteSheet,
      this.currentFrame * anim.width,
      anim.row * anim.height,
      anim.width,
      anim.height,
      x,
      y,
      anim.width,
      anim.height
    );
  }
}
