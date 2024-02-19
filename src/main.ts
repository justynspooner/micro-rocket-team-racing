import Game from "./game/index.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <button id="btn">Connect</button>
  <span id="user"></span>
    <h1>Micro Rocket Team Racing</h1>
    <p class="read-the-docs">
      Connect to log your lap times and see the leaderboard.
    </p>
    <canvas id="canvas" width="700" height="700" style="background-color: #3F8EF0;"></canvas>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  new Game().start();
});
