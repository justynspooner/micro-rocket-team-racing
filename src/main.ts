import Game from "./game/index.ts";
import { initWalletConnect } from "./lib/web3connect.ts";
import "./style.css";

declare global {
  interface Window {
    HCS: any;
    HCSReady: any;
  }
}

window.HCSReady = async function () {
  console.log(
    "All scripts and WASM modules loaded, initializing demo",
    window.HCS
  );
  initWalletConnect();
};

document.addEventListener("DOMContentLoaded", () => {
  new Game().start();
});
