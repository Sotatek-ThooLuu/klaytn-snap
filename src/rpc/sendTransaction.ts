import Caver from "caver-js";

export async function sendTransaction(rlpEncoded: string, caver: Caver): Promise<object> {
    return await caver.rpc.klay.sendRawTransaction(rlpEncoded);
}
