import Caver from "caver-js";

export async function sendTransaction(rlpEncoded: string, caver: Caver): Promise<object> {
    const receipt: object = await caver.rpc.klay.sendRawTransaction(rlpEncoded);
    return receipt;
}
