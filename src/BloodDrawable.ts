import { Game } from "./Game";
import { Drawable } from "./Drawable";

// https://coolors.co/bf1a2f-ef0424-660f1a-8e0114-f70223
const bloodColor = [
  { r: 191, g: 26, b: 47 },
  { r: 239, g: 4, b: 36 },
  { r: 102, g: 15, b: 26 },
  { r: 142, g: 1, b: 20 },
  { r: 247, g: 2, b: 35 }
];

export class BloodDrawable implements Drawable {
  private size: number;
  private color = bloodColor[Math.floor(Math.random() * bloodColor.length)];

  constructor(private game: Game) {
    const antelopeSheet = this.game.sprites.antelopeSheet;
    this.size = antelopeSheet.height / 13;
  }

  draw(x: number, y: number, opacity?: number) {
    const ctx = this.game.ctx;

    const alpha = opacity == null ? 1 : opacity;
    const c = this.color;

    ctx.strokeStyle = null;
    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
    ctx.beginPath();
    ctx.rect(x, y, this.size, this.size);
    ctx.fill();
  }
}
