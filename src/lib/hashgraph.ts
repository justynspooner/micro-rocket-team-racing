import {
  DAppConnector,
  HederaChainId,
  HederaJsonRpcMethod,
  HederaSessionEvent,
  SignTransactionParams,
  transactionBodyToBase64String,
  transactionToTransactionBody,
} from "@hashgraph/hedera-wallet-connect";

import {
  AccountId,
  Hbar,
  LedgerId,
  TransactionId,
  TransferTransaction,
} from "@hashgraph/sdk";

import { SignClientTypes } from "@walletconnect/types";

var dAppConnector: DAppConnector | undefined;

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const metadataName = import.meta.env.VITE_WALLET_CONNECT_METADATA_NAME;
const metadataDescription = import.meta.env
  .VITE_WALLET_CONNECT_METADATA_DESCRIPTION;
const metadataUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_URL;
const metadataIconUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_ICON_URL;

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

export async function hedera_signTransaction(_: Event) {
  if (!dAppConnector) {
    throw new Error("dAppConnector not initialized!");
  }

  const transaction = new TransferTransaction()
    .setTransactionId(TransactionId.generate("0.0.3571648"))
    .setMaxTransactionFee(new Hbar(10))
    .addHbarTransfer("0.0.3571648", new Hbar(-10))
    .addHbarTransfer("0.0.3571649", new Hbar(10));

  const params: SignTransactionParams = {
    signerAccountId: "hedera:testnet:0.0.3571648",
    transactionBody: transactionBodyToBase64String(
      // must specify a node account id for the transaction body
      transactionToTransactionBody(transaction, AccountId.fromString("0.0.16"))
    ),
  };

  const { signatureMap } = await dAppConnector.signTransaction(params);

  console.log({ params, signatureMap });
}

// connect a new pairing string to a wallet via the WalletConnect modal
async function connect(e: Event) {
  e.preventDefault();
  await dAppConnector!.openModal();

  console.log("Connected to wallet!");
}

// disconnect
async function disconnect(e: Event) {
  e.preventDefault();
  await dAppConnector!.disconnectAll();

  console.log("Disconnected from wallet!");
}

document.getElementById("connect")!.onclick = connect;
document.getElementById("disconnect")!.onclick = disconnect;
document.getElementById("sign-transaction")!.onclick = hedera_signTransaction;
