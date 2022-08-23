import Caver from "caver-js";

export async function getAccountKey(address: string, caver: Caver) {
    const accountCreated: boolean = await caver.rpc.klay.accountCreated(address);
    if (!accountCreated) return "Null";

    const accountKey: object = await caver.rpc.klay.getAccountKey(address);
    return accountKey;
}
