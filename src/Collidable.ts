import { Vector } from "./Vector";

export type BoundingRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export class Collidable {
  private _boundingRect: BoundingRect;
  private _boundingRectWidth: number = 0;
  private _boundingRectHeight: number = 0;
  private _boundingRectCenter: Vector = new Vector(0, 0);

  get boundingRect() {
    return this._boundingRect;
  }

  set boundingRect(rect: BoundingRect) {
    this._boundingRect = rect;
    this._boundingRectWidth = rect.right - rect.left;
    this._boundingRectHeight = rect.bottom - rect.top;
    this._boundingRectCenter = new Vector(
      this._boundingRectWidth / 2,
      this._boundingRectHeight / 2
    );
  }

  set boundingRectWidth(width: number) {
    this._boundingRectWidth = width;
  }

  set boundingRectHeight(height: number) {
    this._boundingRectHeight = height;
  }

  get boundingRectWidth(): number {
    return this._boundingRectWidth;
  }

  get boundingRectHeight(): number {
    return this._boundingRectHeight;
  }

  set boundingRectCenter(center: Vector) {
    this._boundingRectCenter = center;
    const centerX = center.x;
    const centerY = center.y;
    this.boundingRect = {
      left: centerX - this._boundingRectWidth / 2,
      top: centerY - this._boundingRectHeight / 2,
      right: centerX + this._boundingRectWidth / 2,
      bottom: centerY + this._boundingRectHeight / 2
    };
  }

  collidesWith(other: Collidable) {
    const r1 = this.boundingRect;
    const r2 = other.boundingRect;

    const noCollision =
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top;

    return !noCollision;
  }
}
