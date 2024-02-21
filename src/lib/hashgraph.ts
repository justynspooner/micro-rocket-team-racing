import {
  DAppConnector,
  HederaChainId,
  HederaJsonRpcMethod,
  HederaSessionEvent,
  SignAndExecuteTransactionParams,
  transactionToBase64String,
} from "@hashgraph/hedera-wallet-connect";

import {
  Hbar,
  HbarUnit,
  LedgerId,
  TopicId,
  TopicMessageSubmitTransaction,
  TransactionId,
} from "@hashgraph/sdk";

import { SignClientTypes } from "@walletconnect/types";

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

var dAppConnector: DAppConnector | undefined;

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const metadataName = import.meta.env.VITE_WALLET_CONNECT_METADATA_NAME;
const metadataDescription = import.meta.env
  .VITE_WALLET_CONNECT_METADATA_DESCRIPTION;
const metadataUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_URL;
const metadataIconUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_ICON_URL;
const replayTopicId = import.meta.env.VITE_HCS_REPLAY_TOPIC_ID;

function saveState(e: SubmitEvent) {
  const formData = new FormData(e.target as HTMLFormElement);
  for (const [key, value] of formData) {
    localStorage.setItem(key, value as string);
  }
}

function getState(key: string) {
  return localStorage.getItem(key) || "";
}

export async function init() {
  const metadata: SignClientTypes.Metadata = {
    name: metadataName,
    description: metadataDescription,
    url: metadataUrl,
    icons: [metadataIconUrl],
  };

  dAppConnector = new DAppConnector(
    metadata,
    LedgerId.TESTNET,
    projectId,
    Object.values(HederaJsonRpcMethod),
    [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
    [HederaChainId.Testnet]
  );

  await dAppConnector.init({ logger: "error" });

  console.log("Initialized dAppConnector!");
}

export async function hedera_signTransaction(payload: any) {
  if (!dAppConnector) {
    throw new Error("dAppConnector not initialized!");
  }

  if (!payload) {
    throw new Error("Payload is required!");
  }

  console.log("Creating transaction...");
  const topicId = TopicId.fromString(replayTopicId);

  const topicMessage = {
    v: "0.0.1",
    type: "replay",
    account: "0.0.3571648",
    data: payload,
  };

  let transaction = new TopicMessageSubmitTransaction({
    topicId,
    message: JSON.stringify(topicMessage, null, 2),
  })
    .setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
    .setTransactionId(TransactionId.generate("0.0.3571648"));

  console.log("Construct parameters...");

  const params: SignAndExecuteTransactionParams = {
    signerAccountId: "hedera:testnet:0.0.3571648",
    transactionList: transactionToBase64String(transaction),
  };

  console.log("Signing transaction...");

  const data = await dAppConnector.signAndExecuteTransaction(params);

  console.log("Transaction signed!");

  console.log(data);

  // console.log(data.result.signatureMap);

  // console.log({ params, signatureMap });
}

// connect a new pairing string to a wallet via the WalletConnect modal
async function connect(e: Event) {
  e.preventDefault();
  await dAppConnector!.openModal();

  // Hide the connect button
  connectButton!.style.display = "none";

  // Show the disconnect button
  disconnectButton!.style.display = "block";

  console.log("Connected to wallet!");
}

// disconnect
async function disconnect(e: Event) {
  e.preventDefault();
  await dAppConnector!.disconnectAll();

  // Hide the disconnect button
  disconnectButton!.style.display = "none";

  // Show the connect button
  connectButton!.style.display = "block";

  console.log("Disconnected from wallet!");
}
