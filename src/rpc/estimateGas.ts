import Caver from "caver-js";

export async function estimateGas(txnObj: object, caver: Caver): Promise<string> {
    return await caver.rpc.klay.estimateGas(txnObj);
}