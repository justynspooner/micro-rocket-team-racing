import { getAccountInfo, isLoggedIn } from "../lib/web3connect";

interface RaceData {
  lapsMs: number[];
  totalMs: number;
}

const RACE_DATA_TOPIC_ID = import.meta.env.VITE_HCS_RACE_DATA_TOPIC_ID;
const GAME_VERSION = import.meta.env.VITE_GAME_VERSION;

enum InscriptionType {
  RaceData = "RaceData",
}

let isInscribing = false;

export async function inscribeRaceData(data: RaceData) {
  if (isInscribing) {
    return;
  }

  isInscribing = true;

  console.log("inscribing data", data);

  const { accountId } = getAccountInfo();

  console.log("account id", accountId);

  const hcsPayload = {
    v: GAME_VERSION,
    type: InscriptionType.RaceData,
    sender: accountId,
    data,
  };

  try {
    console.log("inscribing", hcsPayload);

    if (!isLoggedIn()) {
      alert("You need to connect your wallet in order to submit a score.");
      return;
    }

    const sdk = window.HederaWalletConnectSDK;

    const result = await sdk.submitMessageToTopic(
      RACE_DATA_TOPIC_ID,
      JSON.stringify({
        t_id: RACE_DATA_TOPIC_ID,
        op: "register",
        m: "Submitting score",
        metadata: hcsPayload,
        p: "hcs-2",
      })
    );

    console.log("Inscribed result: ", result);
  } catch (error) {
    console.error("Error inscribing", error);
  } finally {
    console.log("Inscription complete");
    isInscribing = false;
  }
}
