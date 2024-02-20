import Game from "./game/index.ts";
import { init } from "./lib/hashgraph.ts";

import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  init();
  new Game().start();
});
