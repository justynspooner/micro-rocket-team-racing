import Game from "./game/index.ts";
import { init } from "./lib/web3connect.ts";

import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  init();
  new Game().start();
});
