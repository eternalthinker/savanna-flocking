import { Updatable } from "./Updatable";
import { Drawable } from "./Drawable";
import { Vector } from "./Vector";
import { Game } from "./Game";

export class Perishable implements Updatable {
  private opacity = 1;
  private accTimeDelta = 0;
  private lastUpdateTime = Date.now();
  private step = 0;

  constructor(
    private game: Game,
    private drawable: Drawable,
    private position: Vector,
    private stepDuration: number = 1000,
    private opacityStep: number = 0.2
  ) {
    this.game.registerUpdatable(this, "background");
  }

  update() {
    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    this.accTimeDelta += timeDelta;

    this.drawable.draw(this.position.x, this.position.y, this.opacity);

    if (this.accTimeDelta > this.stepDuration) {
      this.accTimeDelta = 0;
      this.opacity -= this.opacityStep;
      this.step++;
      if (this.opacity <= 0) {
        this.game.deregisterUpdatable(this, "background");
      }
    }
  }
}
