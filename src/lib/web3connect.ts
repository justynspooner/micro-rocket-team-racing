const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const metadataName = import.meta.env.VITE_WALLET_CONNECT_METADATA_NAME;
const metadataDescription = import.meta.env
  .VITE_WALLET_CONNECT_METADATA_DESCRIPTION;
const metadataUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_URL;
const metadataIconUrl = import.meta.env.VITE_WALLET_CONNECT_METADATA_ICON_URL;

declare global {
  interface Window {
    HederaWalletConnectSDK: any;
  }
}

const PROJECT_ID = projectId;
const APP_METADATA = {
  name: metadataName,
  description: metadataDescription,
  url: metadataUrl,
  icons: [metadataIconUrl],
};

let _isLoggedIn = false;

let accountInfo = {
  accountId: "",
  balance: "",
};

function updateAccountInfo(accountId?: string, balance?: string) {
  accountInfo = {
    accountId: accountId || "",
    balance: balance || "",
  };

  if (!accountId) {
    _isLoggedIn = false;
    accountIdElement!.innerText = "";
    accountIdElement!.style.display = "none";
    connectButton!.style.display = "block";
    disconnectButton!.style.display = "none";

    return;
  }
  _isLoggedIn = true;
  accountIdElement!.innerText = accountId;
  accountIdElement!.style.display = "block";
  connectButton!.style.display = "none";
  disconnectButton!.style.display = "block";
}

export function isLoggedIn() {
  return _isLoggedIn;
}

export function getAccountInfo() {
  return accountInfo;
}

export async function initWalletConnect() {
  const sdk = window.HederaWalletConnectSDK;
  const accountResponse = await sdk.initAccount(PROJECT_ID, APP_METADATA);

  console.log("Account response:", accountResponse);

  if (accountResponse?.accountId) {
    updateAccountInfo(accountResponse.accountId, accountResponse.balance);
  }
}

async function connectToWallet() {
  try {
    const sdk = window.HederaWalletConnectSDK;
    const { balance, accountId } = await sdk.connectWallet(
      PROJECT_ID,
      APP_METADATA
    );

    updateAccountInfo(accountId, balance);
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
}

async function disconnectFromWallet() {
  try {
    const sdk = window.HederaWalletConnectSDK;
    await sdk.disconnectWallet();

    updateAccountInfo();
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
  }
}

const connectButton = document.getElementById("connect");

if (!connectButton) {
  throw new Error("No connect button found!");
}

connectButton.onclick = connectToWallet;

const disconnectButton = document.getElementById("disconnect");

if (!disconnectButton) {
  throw new Error("No disconnect button found!");
}

disconnectButton.onclick = disconnectFromWallet;

const accountIdElement = document.getElementById("accountId");

updateAccountInfo();
