import "./index.css";
import antelopeImg from "./assets/antelope.png";

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // If it's resolution does not match change it
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img: HTMLImageElement = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", err => reject(err));
    img.src = src;
  });
}

class Game {
  private static instance: Game;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public sprites: { [key: string]: HTMLImageElement };

  private constructor() {}

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
}

function initCanvas() {
  const canvas = <HTMLCanvasElement>document.getElementById("cnvs");
  const ctx = canvas.getContext("2d");
  ctx.translate(0.5, 0.5);
  const game = Game.getInstance();

  resizeCanvasToDisplaySize(canvas);

  game.ctx = ctx;
  game.canvas = canvas;
}

function draw() {
  const game = Game.getInstance();
  const ctx = game.ctx;

  const antelopeImg = game.sprites["antelope"];
  for (let i = 0; i < 50; ++i) {
    const x = Math.floor(Math.random() * game.canvas.width);
    const y = Math.floor(Math.random() * game.canvas.height);
    ctx.drawImage(antelopeImg, x, y);
  }
}

const game = Game.getInstance();
initCanvas();
Promise.all([loadImage(antelopeImg)]).then(([antelopeImg]) => {
  game.sprites = {
    antelope: antelopeImg
  };

  draw();
});
