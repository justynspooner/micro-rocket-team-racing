import "../lib/roundRect";

import Canvas from "../lib/canvas";
import Viewport from "../lib/viewport";
import { inscribeRaceData } from "../util/inscriber";
import cars from "./cars";
import Hud, { RaceState } from "./hud";
import PlayerCar from "./player-car";
import Track from "./track";
import tracks from "./tracks";

export default class Game {
  tickInterval: number;
  cellWidth: number;
  cellHeight: number;
  timer: null;
  canvas: null;
  viewport: null;
  objects: never[];
  keys: {
    left: number;
    right: number;
    accelerate: number;
    brake: number;
    handbrake: number;
    // 'r' key to reset game
    resetGame: number;
    // 'i' key to inscribe data to HCS
    inscribeData: number;
  };
  keysDown: {
    left: boolean;
    right: boolean;
    accelerate: boolean;
    brake: boolean;
    handbrake: boolean;
    resetGame: boolean;
    inscribeData: boolean;
  };
  friction: number;
  track: any;
  hud: any;

  constructor() {
    this.tickInterval = 60;
    this.cellWidth = 10;
    this.cellHeight = 10;

    this.timer = null;
    this.canvas = null;
    this.viewport = null;

    this.objects = [];

    this.keys = {
      left: 65,
      right: 68,
      accelerate: 87,
      brake: 83,
      handbrake: 32,
      // 'r' key to reset game
      resetGame: 82,
      // 'i' key to inscribe data to HCS
      inscribeData: 73,
    };

    this.keysDown = {
      left: false,
      right: false,
      accelerate: false,
      brake: false,
      handbrake: false,
      resetGame: false,
      inscribeData: false,
    };

    this.friction = 0.82;
  }

  onKeydownListener(e) {
    if (
      e.keyCode === this.keys.accelerate ||
      e.keyCode === this.keys.brake ||
      e.keyCode === this.keys.left ||
      e.keyCode === this.keys.right ||
      e.keyCode === this.keys.handbrake ||
      e.keyCode === this.keys.resetGame ||
      e.keyCode === this.keys.inscribeData
    ) {
      e.preventDefault();
    }

    // left

    if (e.keyCode === this.keys.left) {
      this.keysDown.left = true;
    }

    // right

    if (e.keyCode === this.keys.right) {
      this.keysDown.right = true;
    }

    // up

    if (e.keyCode === this.keys.accelerate) {
      this.keysDown.accelerate = true;
    }

    // down

    if (e.keyCode === this.keys.brake) {
      this.keysDown.brake = true;
    }

    // slide

    if (e.keyCode === this.keys.handbrake) {
      this.keysDown.handbrake = true;
    }

    // reset game

    if (e.keyCode === this.keys.resetGame) {
      this.keysDown.resetGame = true;
    }

    // inscribe data

    if (e.keyCode === this.keys.inscribeData) {
      console.log("Inscribe Data Key Down");
      this.keysDown.inscribeData = true;
    }
  }

  onKeyupListener(e) {
    if (
      e.keyCode === this.keys.left ||
      e.keyCode === this.keys.right ||
      e.keyCode === this.keys.accelerate ||
      e.keyCode === this.keys.brake ||
      e.keyCode === this.keys.handbrake ||
      e.keyCode === this.keys.resetGame ||
      e.keyCode === this.keys.inscribeData
    ) {
      e.preventDefault();
    }

    // left

    if (e.keyCode === this.keys.left) {
      this.keysDown.left = false;
    }

    // right

    if (e.keyCode === this.keys.right) {
      this.keysDown.right = false;
    }

    // up

    if (e.keyCode === this.keys.accelerate) {
      this.keysDown.accelerate = false;
    }

    // down

    if (e.keyCode === this.keys.brake) {
      this.keysDown.brake = false;
    }

    // slide

    if (e.keyCode === this.keys.handbrake) {
      this.keysDown.handbrake = false;
    }

    // reset game

    if (e.keyCode === this.keys.resetGame) {
      this.keysDown.resetGame = false;
    }

    // inscribe data

    if (e.keyCode === this.keys.inscribeData) {
      console.log("Inscribe Data Key Up");
      this.keysDown.inscribeData = false;
    }
  }

  bindEvents() {
    // keydown events

    document.addEventListener("keydown", this.onKeydownListener.bind(this));

    // keyup events

    document.addEventListener("keyup", this.onKeyupListener.bind(this));
  }

  tick() {
    // clear canvas

    this.canvas.clear();

    // draw objects

    this.objects.forEach((obj) => obj.draw(this));

    // draw quadtree

    this.track.quadtree.draw(this);

    // draw viewport

    this.viewport.draw(this);

    // Check for game reset
    if (this.keysDown.resetGame) {
      this.keysDown.resetGame = false;
      this.reset();
    }

    // Check for data inscribe

    if (
      this.keysDown.inscribeData &&
      this.hud.raceState() === RaceState.FINISHED
    ) {
      this.keysDown.inscribeData = false;

      inscribeRaceData({
        lapTimesInMilliseconds: this.hud.lapTimes,
        raceTimeInMilliseconds: this.hud.finalRaceTime,
      });
    }
  }

  reset() {
    // Clear timer

    clearInterval(this.timer);

    // Unbind events

    console.log("Game Reset");

    document.removeEventListener("keydown", this.onKeydownListener);
    document.removeEventListener("keyup", this.onKeyupListener);

    // Clear objects

    this.objects = [];

    // Restart game

    this.start();
  }

  start() {
    // create canvas object

    this.canvas = new Canvas(document.getElementById("canvas"));

    // add objects

    this.track = new Track(tracks.rocket);

    this.hud = new Hud(tracks.rocket);

    this.objects.push(this.track);

    console.log(`Canvas Width: ${this.canvas.width}`);
    console.log(`Canvas Height: ${this.canvas.height}`);

    this.objects.push(
      new PlayerCar(
        Object.assign({}, cars.rocket, {
          x: -this.track.startPositions[0].x + this.canvas.width / 2,
          y: -this.track.startPositions[0].y + this.canvas.height / 2,
          angle: this.track.startAngle,
        })
      )
    );

    this.objects.push(this.hud);

    // this.objects.push(
    //   new AICar(
    //     Object.assign({}, cars.greenSport, {
    //       x: track.startPositions[1].x,
    //       y: track.startPositions[1].y,
    //       angle: track.startAngle,
    //       recordedPositions: track.recordedPositions[0],
    //     })
    //   )
    // );

    // create viewport object

    this.viewport = new Viewport({
      height: this.canvas.height,
      width: this.canvas.width,
      margin: 0,
    });

    // bind events

    this.bindEvents();

    // run internal ticker

    this.timer = setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }

  onWaypointTriggered(waypointIndex) {
    this.hud.onWaypointTriggered(waypointIndex);
  }
}
