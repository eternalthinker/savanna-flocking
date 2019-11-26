import { Layer } from "./Layer";
import { Updatable } from "./Updatable";

export class Game {
  private static instance: Game;

  public layers: Record<string, Layer> = {
    background: new Layer(),
    foreground: new Layer()
  };
  private layerStack = ["background", "content", "foreground"];

  public readonly gravity = 0.1;
  public drawBoundingRect = false;
  public showBlood = true;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public sprites: { [key: string]: HTMLImageElement | HTMLCanvasElement };

  private constructor() {}

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  registerUpdatable(u: Updatable, layer: string) {
    this.layers[layer].registerUpdatable(u);
  }

  deregisterUpdatable(u: Updatable, layer: string) {
    this.layers[layer].deregisterUpdatable(u);
  }

  update() {
    this.layerStack.forEach(layerName => this.layers[layerName].update());
  }
}
