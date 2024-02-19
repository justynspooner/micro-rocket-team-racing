import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";

import { disconnect, getAccount, reconnect, watchAccount } from "@wagmi/core";

import { hedera, hederaTestnet } from "viem/chains";

function connect() {
  if (getAccount(config).isConnected) {
    disconnect(config);
  } else {
    modal.open();
  }
}

const btnEl = document.getElementById("btn");
const userEl = document.getElementById("user");

btnEl?.addEventListener("click", connect);

// 1. Define constants
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const metadataName = import.meta.env.VITE_WALLET_CONNECT_METADATA_NAME;
const metadataDescription = import.meta.env
  .VITE_WALLET_CONNECT_METADATA_DESCRIPTION;
const metadataUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_URL;
const metadataIconUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_ICON_URL;

// 2. Create wagmiConfig
const metadata = {
  name: metadataName,
  description: metadataDescription,
  url: metadataUrl, // origin must match your domain & subdomain
  icons: [metadataIconUrl],
};

const chains = [hedera, hederaTestnet];
export const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  //   ...wagmiOptions, // Optional - Override createConfig parameters
});
reconnect(config);

// 3. Create modal
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

// listening for account changes
watchAccount(config, {
  onChange(account) {
    userEl.innerText = account.address ?? "";
    if (account.isConnected) {
      btnEl.innerText = "Disconnect";
    } else {
      btnEl.innerText = "Connect";
    }
  },
});
