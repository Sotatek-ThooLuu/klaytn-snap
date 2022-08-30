import Caver from "caver-js";
import { fromPeb } from "./utils";

export async function estimateGas(caver: Caver, txn: object): Promise<string> {
    return await caver.rpc.klay.estimateGas(txn);
}

export async function getBalance(caver: Caver, address: string): Promise<string> {
    const balance: string = await caver.rpc.klay.getBalance(address);
    return fromPeb(caver, balance, "KLAY");
}