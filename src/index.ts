import { Drawable } from "./Drawable";
import { Lion } from "./Lion";
import "./index.css";
import antelopeSheet from "./assets/antelope_sheet.png";
import lionSheet from "./assets/lion_sheet.png";
import { Antelope } from "./Antelope";
import { Animation } from "./Sprite";
import { Game } from "./Game";
import { Perishable } from "./Perishable";
import { Vector } from "./Vector";

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

function initCanvas() {
  const canvas = <HTMLCanvasElement>document.getElementById("cnvs");
  resizeCanvasToDisplaySize(canvas);

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.translate(0.5, 0.5);

  const game = Game.getInstance();
  game.ctx = ctx;
  game.canvas = canvas;
}

function initBgCanvas(game: Game) {
  const canvas = <HTMLCanvasElement>document.getElementById("bgCnvs");
  resizeCanvasToDisplaySize(canvas);

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.translate(0.5, 0.5);

  ctx.fillStyle = "#987ffa"; //"#70b575";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
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

class CircleDrawable implements Drawable {
  private size: number;
  private color = {
    r: 255,
    g: 255,
    b: 255
  };

  constructor(private game: Game) {
    const antelopeSheet = this.game.sprites.antelopeSheet;
    this.size = antelopeSheet.height / 2;
  }

  draw(x: number, y: number, opacity?: number) {
    const ctx = this.game.ctx;

    const alpha = opacity == null ? 1 : opacity;
    const c = this.color;

    ctx.strokeStyle = null;
    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

let lastUpdateTime = Date.now();
let accTimeDelta = 0;

function draw(antelopes: Antelope[], lions: Lion[]) {
  const game = Game.getInstance();
  const ctx = game.ctx;
  ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

  game.layers["background"].update();

  antelopes = antelopes.filter(antelope => antelope.isAlive);

  antelopes.forEach(antelope => {
    antelope.flockWithFlee(antelopes, lions);
    antelope.update();
  });

  lions.forEach(lion => {
    lion.flockWithChase(lions, antelopes);
    lion.update();
  });

  game.layers["foreground"].update();

  const currentTime = Date.now();
  const timeDelta = currentTime - lastUpdateTime;
  accTimeDelta += timeDelta;
  lastUpdateTime = currentTime;

  if (accTimeDelta > 5000) {
    accTimeDelta = 0;
    const x = Math.floor(Math.random() * game.canvas.width);
    const y = Math.floor(Math.random() * game.canvas.height);
    const antelope = new Antelope(x, y, game);
    antelopes.push(antelope);
    antelope.update();
    const _perishable = new Perishable(
      game,
      new CircleDrawable(game),
      new Vector(x, y),
      100,
      0.1
    );
  }

  window.requestAnimationFrame(() => draw(antelopes, lions));
}

const game = Game.getInstance();
initCanvas();
Promise.all([loadImage(antelopeSheet), loadImage(lionSheet)]).then(
  ([antelopeSheet, lionSheet]) => {
    game.sprites = {
      antelopeSheet,
      lionSheet,
      antelopeSheet_flipX: getFlipXSpriteSheet({
        spriteSheet: antelopeSheet,
        row: 0,
        frameCount: 6,
        frameDuration: 100
      }),
      lionSheet_flipX: getFlipXSpriteSheet({
        spriteSheet: lionSheet,
        row: 0,
        frameCount: 6,
        frameDuration: 100
      })
    };

    initBgCanvas(game);

    const antelopes: Antelope[] = [];
    for (let i = 0; i < 50; ++i) {
      const x = Math.floor(Math.random() * game.canvas.width);
      const y = Math.floor(Math.random() * game.canvas.height);
      antelopes.push(new Antelope(x, y, game));
    }

    const lions: Lion[] = [];
    for (let i = 0; i < 10; ++i) {
      const x = Math.floor(Math.random() * game.canvas.width);
      const y = Math.floor(Math.random() * game.canvas.height);
      lions.push(new Lion(x, y, game));
    }

    window.requestAnimationFrame(() => draw(antelopes, lions));
  }
);
