import PlayerCar from "../game/player-car";

interface ViewportOptions {
  height: number;
  width: number;
  margin: number;
}

export default class Viewport {
  x: number;
  y: number;
  height: number;
  width: number;
  margin: number;
  centre: { x: number; y: number };

  constructor(opts: ViewportOptions) {
    this.x = 0;
    this.y = 0;

    this.height = opts.height;
    this.width = opts.width;
    this.margin = opts.margin;

    this.centre = {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  draw(game: { objects: any[] }) {
    const playerCar = game.objects.find((obj) => obj instanceof PlayerCar);

    if (playerCar) {
      this.x = playerCar.x;
      this.y = playerCar.y;
    }
  }
}
