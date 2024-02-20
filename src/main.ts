import Game from "./game/index.ts";
import { init } from "./lib/hashgraph.ts";

import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Micro Rocket Team Racing</h1>
    <p class="read-the-docs">
      Connect to log your lap times and see the leaderboard.
    </p>
    <canvas id="canvas" width="700" height="700" style="background-color: #3F8EF0;"></canvas>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  init();
  new Game().start();
});
