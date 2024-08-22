// const Car = require("./car");
import Car from "./car";

export default class AICar extends Car {
  recordedPositions: any;
  recordedPositionIndex: number;

  constructor(opts: any) {
    super(opts);

    this.recordedPositions = opts.recordedPositions;
    this.recordedPositionIndex = 0;
  }

  draw(game: any) {
    const recordedPosition = this.recordedPositions[this.recordedPositionIndex];

    this.x = (recordedPosition.x - game.viewport.width / 2) * -1;
    this.y = (recordedPosition.y - game.viewport.height / 2) * -1;
    this.angle = recordedPosition.angle;

    // draw

    super.draw(game, this.x + game.viewport.x, this.y + game.viewport.y);

    // increment position

    if (this.recordedPositionIndex === this.recordedPositions.length - 1) {
      this.recordedPositionIndex = 0;
    } else {
      this.recordedPositionIndex++;
    }
  }
}
