import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import { hashconnect, pairingData } from "../lib/web3connect";

interface RaceData {
  lapTimesInMilliseconds: number[];
  raceTimeInMilliseconds: number;
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

  const accountId = pairingData?.accountIds[0];
  if (!accountId) {
    alert("Please connect your wallet to inscribe your race data");
    return;
  }

  isInscribing = true;

  const hcsPayload = {
    v: GAME_VERSION,
    type: InscriptionType.RaceData,
    sender: accountId,
    data,
  };

  try {
    const signer = hashconnect.getSigner(accountId);

    let trans = await new TopicMessageSubmitTransaction({
      topicId: RACE_DATA_TOPIC_ID,
      message: JSON.stringify(hcsPayload, null, 2),
    }).freezeWithSigner(signer);

    await trans.executeWithSigner(signer);
  } catch (error) {
    console.error("Error inscribing", error);
  } finally {
    isInscribing = false;
  }
}
