import Caver, { ValueTransfer } from "caver-js";
import { estimateGas } from "../rpc/estimateGas";

export async function createTransactionObject(txn: object, caver: Caver): Promise<ValueTransfer> {
    // const gas = await estimateGas(txn, caver);
    const valueTransfer: ValueTransfer = caver.transaction.valueTransfer.create({ ...txn, gas: 100000 });
    await valueTransfer.fillTransaction();

    return valueTransfer;
}