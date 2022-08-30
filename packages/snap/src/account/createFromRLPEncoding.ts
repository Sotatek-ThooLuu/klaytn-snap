import Caver, { Account } from "caver-js";

export async function createFromRLPEncoding(address: string, rlpEncodedKey: string, caver: Caver): Promise<Account> {
    const accountCreated: boolean = await caver.rpc.klay.accountCreated(address);
    if (!accountCreated) throw new Error("Invalid Account");

    return caver.account.createFromRLPEncoding(address, rlpEncodedKey);
}
