import { Lion } from "./Lion";
import "./index.css";
import antelopeImg from "./assets/antelope.png";
import lionImg from "./assets/lion.png";
import { Antelope } from "./Antelope";

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

function draw(antelopes: Antelope[], lions: Lion[]) {
  const game = Game.getInstance();
  const ctx = game.ctx;
  ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

  antelopes.forEach(antelope => {
    antelope.flockWithFlee(antelopes, lions);
    // if (antelope.position.x < 0) {
    //   antelope.position.x = 0;
    //   //antelope.velocity.mul(-1);
    // }
    // if (antelope.position.y < 0) {
    //   antelope.position.y = 0;
    //   //antelope.velocity.mul(-1);
    // }
    // if (antelope.position.x > game.canvas.width) {
    //   antelope.position.x = game.canvas.width - game.sprites["antelope"].width;
    //   //antelope.velocity.mul(-1);
    // }

    // if (antelope.position.y > game.canvas.height) {
    //   antelope.position.y =
    //     game.canvas.height - game.sprites["antelope"].height;
    //   //antelope.velocity.mul(-1);
    // }

    antelope.draw();
  });

  lions.forEach(lion => {
    lion.flockWithChase(lions, antelopes);
    lion.draw();
  });

  window.requestAnimationFrame(() => draw(antelopes, lions));
}

const game = Game.getInstance();
initCanvas();
Promise.all([loadImage(antelopeImg), loadImage(lionImg)]).then(
  ([antelopeImg, lionImg]) => {
    game.sprites = {
      antelope: antelopeImg,
      lion: lionImg
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
  }
);
