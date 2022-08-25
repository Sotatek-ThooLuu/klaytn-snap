import Caver from "caver-js";

export async function getBalance(address: string, caver: Caver): Promise<string> {
    // const accountCreated: boolean = await caver.rpc.klay.accountCreated(address);
    // if (!accountCreated) return "Null";
    
    const balance: string = await caver.rpc.klay.getBalance(address);
    return caver.utils.fromPeb(balance, 'KLAY');
}