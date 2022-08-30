import Caver, { Account } from "caver-js";

export async function createWithAccountKeyRoleBased(address: string, roledBasedPublicKeyArray: string[][], caver: Caver): Promise<Account> {
    const accountCreated: boolean = await caver.rpc.klay.accountCreated(address);
    if (!accountCreated) throw new Error("Invalid Account");

    return caver.account.createWithAccountKeyRoleBased(address, roledBasedPublicKeyArray);
}