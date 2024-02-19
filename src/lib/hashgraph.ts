import {
  DAppConnector,
  HederaChainId,
  HederaJsonRpcMethod,
  HederaSessionEvent,
  SignTransactionParams,
  transactionBodyToBase64String,
  transactionToTransactionBody,
} from "@hashgraph/hedera-wallet-connect";
import { AccountId, Hbar, LedgerId, TransferTransaction } from "@hashgraph/sdk";

import { SignClientTypes } from "@walletconnect/types";

var dAppConnector: DAppConnector | undefined;

async function init(e: Event) {
  const projectId = getState("project-id");
  const metadata: SignClientTypes.Metadata = {
    name: getState("name"),
    description: getState("description"),
    url: getState("url"),
    icons: [getState("icons")],
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

  const eventTarget = e.target as HTMLElement;
  eventTarget
    .querySelectorAll("input,button")
    .forEach((input) => ((input as HTMLInputElement).disabled = true));
  document
    .querySelectorAll(".toggle input,.toggle button, .toggle select")
    .forEach((element) => ((element as HTMLInputElement).disabled = false));

  return "dApp: WalletConnect initialized!";
}

export async function hedera_signTransaction(_: Event) {
  const transaction = new TransferTransaction()
    .setTransactionId(TransactionId.generate(getState("sign-from")))
    .setMaxTransactionFee(new Hbar(1))
    .addHbarTransfer(getState("sign-from"), new Hbar(-getState("sign-amount")))
    .addHbarTransfer(getState("sign-to"), new Hbar(+getState("sign-amount")));

  const params: SignTransactionParams = {
    signerAccountId: "hedera:testnet:" + getState("sign-from"),
    transactionBody: transactionBodyToBase64String(
      // must specify a node account id for the transaction body
      transactionToTransactionBody(transaction, AccountId.fromString("0.0.3"))
    ),
  };

  const { signatureMap } = await dAppConnector!.signTransaction(params);
  document.getElementById("sign-transaction-result")!.innerText =
    JSON.stringify({ params, signatureMap }, null, 2);
  console.log({ params, signatureMap });
}
