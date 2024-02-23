import { LedgerId } from "@hashgraph/sdk";
import {
  HashConnect,
  HashConnectConnectionState,
  SessionData,
} from "hashconnect";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const metadataName = import.meta.env.VITE_WALLET_CONNECT_METADATA_NAME;
const metadataDescription = import.meta.env
  .VITE_WALLET_CONNECT_METADATA_DESCRIPTION;
const metadataUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_URL;
const metadataIconUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_ICON_URL;

const appMetadata = {
  name: metadataName,
  description: metadataDescription,
  icons: [metadataIconUrl],
  url: metadataUrl,
};

export let hashconnect: HashConnect;
export let state: HashConnectConnectionState =
  HashConnectConnectionState.Disconnected;
export let pairingData: SessionData;

export async function init() {
  //create the hashconnect instance
  hashconnect = new HashConnect(LedgerId.MAINNET, projectId, appMetadata, true);

  //register events
  setUpHashConnectEvents();

  //initialize
  await hashconnect.init();
}

export async function connect() {
  //open pairing modal
  hashconnect.openPairingModal();
}

export async function disconnect() {
  hashconnect.disconnect();
}

function setUpHashConnectEvents() {
  hashconnect.pairingEvent.on((newPairing: SessionData) => {
    pairingData = newPairing;

    console.log("Pairing event", pairingData);

    // Update the account id
    accountIdElement!.innerText = pairingData.accountIds[0];

    // Show the account id
    accountIdElement!.style.display = "block";
  });

  hashconnect.disconnectionEvent.on(() => {
    console.log("Disconnected");
    pairingData = null;

    accountIdElement!.innerText = "";

    // Hide the account id
    accountIdElement!.style.display = "none";
  });

  hashconnect.connectionStatusChangeEvent.on(
    (connectionStatus: HashConnectConnectionState) => {
      console.log("Connection status changed", connectionStatus);
      state = connectionStatus;

      if (state === HashConnectConnectionState.Paired) {
        // Hide the connect button
        connectButton!.style.display = "none";

        // Show the disconnect button
        disconnectButton!.style.display = "block";
      } else {
        // Show the connect button
        connectButton!.style.display = "block";

        // Hide the disconnect button
        disconnectButton!.style.display = "none";
      }
    }
  );
}

const connectButton = document.getElementById("connect");
if (!connectButton) {
  throw new Error("No connect button found!");
}
connectButton.onclick = connect;

const disconnectButton = document.getElementById("disconnect");
if (!disconnectButton) {
  throw new Error("No disconnect button found!");
}
disconnectButton.onclick = disconnect;

const accountIdElement = document.getElementById("accountId");
