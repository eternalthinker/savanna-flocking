import { Game } from "./Game";
import { throttle } from "lodash";
import { Collidable } from "./Collidable";
import { Drawable } from "./Drawable";

export type Animation = {
  spriteSheet: HTMLImageElement | HTMLCanvasElement;
  row: number;
  frameCount: number;
  frameDuration: number;
  width?: number;
  height?: number;
};

export class Sprite extends Collidable implements Drawable {
  private _flipX: boolean = false;
  protected loop: boolean = true;
  protected currentAnimation: string;
  protected currentFrame: number = 0;
  protected animations: { [key: string]: Animation } = {};
  private accTimeDelta: number = 0;
  private playing: boolean = true;
  private lastUpdateTime = Date.now();
  public width: number = 0;
  public height: number = 0;
  public boundingRectColor: string = "#00ff00";

  private setFlipXThrottled: (flipX: boolean) => void;

  constructor(protected game: Game) {
    super();
    this.setFlipXThrottled = throttle(this.setFlipX.bind(this), 250);
  }

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

  private setFlipX(flipX: boolean) {
    if (!this._flipX && flipX) {
      this.setAnimation(`${this.currentAnimation}_flipX`);
    } else if (this._flipX && !flipX) {
      this.setAnimation(this.currentAnimation.replace("_flipX", ""));
    }
    this._flipX = flipX;
  }

  set flipX(flipX: boolean) {
    this.setFlipXThrottled(flipX);
  }

  setAnimation(name: string, resetFrame = false) {
    this.currentAnimation = name;
    if (resetFrame) {
      this.currentFrame = 0;
    }
    this.playing = true;
  }

  draw(x: number, y: number, opacity?: number) {
    const timeDelta = Date.now() - this.lastUpdateTime;
    this.accTimeDelta += timeDelta;

    this.render(x, y, opacity);
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

  render(x: number, y: number, opacity?: number) {
    const ctx = this.game.ctx;

    if (opacity != null) {
      ctx.save();
      ctx.globalAlpha = opacity;
    }

    const anim = this.animations[this.currentAnimation];
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

    if (opacity != null) {
      ctx.restore();
    }

    if (this.game.drawBoundingRect) {
      const ctx = this.game.ctx;
      ctx.strokeStyle = this.boundingRectColor;
      ctx.beginPath();
      const r = this.boundingRect;
      ctx.rect(r.left, r.top, this.boundingRectWidth, this.boundingRectHeight);
      ctx.stroke();
    }
  }
}
