import Quadtree from "../lib/quadtree";

export default class Track {
  cog = new Image();
  name: string;
  height: number;
  width: number;
  startPositions: any;
  startAngle: number;
  recordedPositions: any;
  obstacles: any;
  waypoints: any;
  quadtree: any;
  trackImageHasLoaded: boolean;
  img: HTMLImageElement;
  trackId: string;

  constructor(opts: any) {
    this.cog.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg==";

    this.name = opts.name;
    this.trackId = opts.id;

    this.height = opts.height;
    this.width = opts.width;
    this.startPositions = opts.startPositions;
    this.startAngle = opts.startAngle;
    this.recordedPositions = opts.recordedPositions;
    this.obstacles = opts.obstacles;
    this.waypoints = opts.waypoints;

    // Define the boundary of the entire quadtree
    const boundary = {
      x: 0,
      y: 0,
      width: opts.width,
      height: opts.height,
    };

    // Create the quadtree with a boundary and capacity
    const qt = new Quadtree(boundary, 4);

    // Insert objects into the quadtree
    this.obstacles.forEach((obstacle: any) => {
      qt.insert(obstacle);
    });

    qt.logNode();

    this.quadtree = qt;
    this.trackImageHasLoaded = false;

    // image
    this.img = new Image();
    this.img.onload = () => {
      this.trackImageHasLoaded = true;
    };
    // Add the file from src/game/rocketStadium.png to the image
    this.img.src = opts.imageLocation;
  }

  draw(game: any) {
    game.canvas.context.save();
    if (!this.trackImageHasLoaded) {
      game.canvas.context.globalCompositeOperation = "destination-over";
      game.canvas.context.save();
      game.canvas.context.clearRect(
        0,
        0,
        game.canvas.width,
        game.canvas.height
      );
      game.canvas.context.translate(
        game.canvas.width / 2,
        game.canvas.height / 2 + 40
      ); //translate to center of canvas

      game.canvas.context.rotate((game.frame * Math.PI) / 64); //rotate in origin
      game.canvas.context.translate(-13.5, -13.5);
      game.canvas.context.drawImage(this.cog, 0, 0);
      game.canvas.context.restore();

      // Display a loading spinner in the middle of the canvas

      game.canvas.context.font = "20px Arial";
      game.canvas.context.textAlign = "center";
      game.canvas.context.textBaseline = "middle";
      game.canvas.context.fillStyle = "rgba(255, 255, 255, 0.8)";
      game.canvas.context.fillText(
        `Preparing track, please wait…`,
        game.canvas.width / 2,
        game.canvas.height / 2 + 80
      );
    } else {
      game.canvas.context.drawImage(this.img, game.viewport.x, game.viewport.y);
    }

    // draw obstacles

    // game.canvas.context.fillStyle = "rgba(0, 0, 255, 0.8)";
    // game.canvas.context.strokeStyle = "rgba(255, 0, 0, 0.5)";
    // game.canvas.context.lineWidth = 2;

    // console.log("game.viewport.x", game.viewport.x);
    // console.log("game.viewport.y", game.viewport.y);
    // console.log("game.canvas.width", game.canvas.width);
    // console.log("game.canvas.height", game.canvas.height);

    // Filter out obstacles that are not in the viewport
    // const visibleObstacles = this.quadtree.query({
    //   x: game.viewport.x,
    //   y: game.viewport.y,
    //   width: game.canvas.width,
    //   height: game.canvas.height,
    // });

    // this.obstacles.forEach((obstacle) => {
    //   // Draw the rectangle
    //   game.canvas.context.fillRect(
    //     obstacle.x + game.viewport.x,
    //     obstacle.y + game.viewport.y,
    //     obstacle.width,
    //     obstacle.height
    //   );
    // });

    // Draw the waypoints
    // game.canvas.context.fillStyle = "rgba(0, 255, 0, 0.5)";
    // game.canvas.context.strokeStyle = "rgba(0, 255, 0, 0.5)";
    // game.canvas.context.lineWidth = 2;
    // game.canvas.context.beginPath();
    // this.waypoints.forEach((waypoint) => {
    //   game.canvas.context.roundRect(
    //     waypoint.x + game.viewport.x,
    //     waypoint.y + game.viewport.y,
    //     waypoint.width,
    //     waypoint.height,
    //     10
    //   );
    // });
    // game.canvas.context.fill();

    game.canvas.context.restore();
  }
}
