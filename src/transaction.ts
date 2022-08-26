import Caver, {
    SingleKeyring,
    TransactionReceipt,
    ValueTransfer,
} from "caver-js";
import { getKeyPair } from "./account";
import { KeyPair } from "./interface";
import { createKeyring } from "./wallet";

export async function sendTransaction(
    caver: Caver,
    from: string,
    to: string,
    value: string
): Promise<TransactionReceipt> {
    const keyPair: KeyPair = await getKeyPair(wallet);
    const keyring: SingleKeyring = createKeyring(
        caver,
        keyPair.address,
        keyPair.privateKey
    );
    caver.wallet.add(keyring);

    const valueTransfer: ValueTransfer = await createValueTransfer(caver, {
        from,
        to,
        value: caver.utils.toPeb(value, "KLAY"),
    });
    await caver.wallet.sign(keyring.address, valueTransfer);
    return await caver.rpc.klay.sendRawTransaction(valueTransfer);
}

export async function createValueTransfer(
    caver: Caver,
    txn: object
): Promise<ValueTransfer> {
    // const gas = await estimateGas(caver, txn);
    const valueTransfer: ValueTransfer = caver.transaction.valueTransfer.create(
        { ...txn, gas: 100000 }
    );
    await valueTransfer.fillTransaction();

    return valueTransfer;
}
