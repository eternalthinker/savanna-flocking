import { Lion } from "./Lion";
import "./index.css";
import antelopeImg from "./assets/antelope.png";
import lionImg from "./assets/lion.png";
import antelopeSheet from "./assets/antelope_sheet.png";
import { Antelope } from "./Antelope";
import { Animation } from "./Sprite";

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

export class Game {
  private static instance: Game;

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

function getFlipXSpriteSheet(animation: Animation) {
  const spriteSheet = animation.spriteSheet;
  const flipCanvas = document.createElement("canvas");
  flipCanvas.width = spriteSheet.width;
  flipCanvas.height = spriteSheet.height;
  var fctx = flipCanvas.getContext("2d");
  fctx.save();
  fctx.translate(spriteSheet.width, 0);
  fctx.scale(-1, 1);
  fctx.drawImage(spriteSheet, 0, 0);
  fctx.restore();

  const width = spriteSheet.width / animation.frameCount;
  const animCanvas = document.createElement("canvas");
  animCanvas.width = spriteSheet.width;
  animCanvas.height = spriteSheet.height;
  var actx = animCanvas.getContext("2d");
  for (let frame = animation.frameCount - 1; frame >= 0; --frame) {
    actx.drawImage(
      flipCanvas,
      frame * width,
      animation.row * spriteSheet.height,
      width,
      spriteSheet.height,
      (animation.frameCount - frame - 1) * width,
      animation.row * spriteSheet.height,
      width,
      spriteSheet.height
    );
  }

  return animCanvas;
}

function draw(antelopes: Antelope[], lions: Lion[]) {
  const game = Game.getInstance();
  const ctx = game.ctx;
  // ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  ctx.fillStyle = "#987ffa";
  ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

  antelopes.forEach(antelope => {
    antelope.flockWithFlee(antelopes, lions);
    antelope.update();
  });

  lions.forEach(lion => {
    lion.flockWithChase(lions, antelopes);
    lion.draw();
  });

  window.requestAnimationFrame(() => draw(antelopes, lions));
}

const game = Game.getInstance();
initCanvas();
Promise.all([
  loadImage(antelopeImg),
  loadImage(lionImg),
  loadImage(antelopeSheet)
]).then(([antelopeImg, lionImg, antelopeSheet]) => {
  game.sprites = {
    antelope: antelopeImg,
    lion: lionImg,
    antelopeSheet,
    antelopeSheet_flipX: getFlipXSpriteSheet({
      spriteSheet: antelopeSheet,
      row: 0,
      frameCount: 6,
      frameDuration: 100
    })
  };

  const antelopes: Antelope[] = [];
  for (let i = 0; i < 50; ++i) {
    const x = Math.floor(Math.random() * game.canvas.width);
    const y = Math.floor(Math.random() * game.canvas.height);
    antelopes.push(new Antelope(x, y, game));
  }

  const lions: Lion[] = [];
  for (let i = 0; i < 1; ++i) {
    const x = Math.floor(Math.random() * game.canvas.width);
    const y = Math.floor(Math.random() * game.canvas.height);
    lions.push(new Lion(x, y, game));
  }

  window.requestAnimationFrame(() => draw(antelopes, lions));
});
