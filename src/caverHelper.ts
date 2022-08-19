import { BIP44Node } from '@metamask/key-tree';
import Caver, { SingleKeyring, Unit, ValueTransfer } from 'caver-js'

export const fromPeb = (value: string, unit: Unit): string => {
    return caver.utils.fromPeb(value, unit);
}

export const toPeb = (value: string | number, unit: Unit): string => {
    return caver.utils.toPeb(value, unit)
}

export const toHex = (value: string): string => {
    return caver.utils.toHex(value);
}

export const caver = new Caver('https://public-node-api.klaytnapi.com/v1/baobab');

export const getBalance = async (address: string): Promise<string> => {
    const isExisted = await caver.rpc.klay.accountCreated(address);
    
    if (isExisted) {
        const balance = await caver.klay.getBalance(address);
        return fromPeb(balance, 'KLAY');
    }
    return "NaN";
}

export const sendToken = async (from: string, to: string, value: string): Promise<void> => {
    try {
        const txn = { from, to, value: toPeb(value, 'KLAY') };
        const gas = await caver.rpc.klay.estimateGas(txn);
        const valueTransfer: ValueTransfer = caver.transaction.valueTransfer.create({ ...txn, gas });
        await valueTransfer.fillTransaction();

        await caver.wallet.sign(from, valueTransfer);
        const rlpEncoded = valueTransfer.getRLPEncoding();
        await caver.rpc.klay.sendRawTransaction(rlpEncoded);
    } catch (err) {
        console.error(err.message);
    }
    
    // const keyring: SingleKeyring = caver.wallet.keyring.create(from.address, from.privateKey);
    // caver.wallet.add(keyring);
    
    // const amountToSend = toHex(toPeb(value, 'KLAY'));
    // const gas = toHex(toPeb(30000, 'peb'));

    // const valueTransfer: ValueTransfer = caver.transaction.valueTransfer.create({
    //     from: from.address, 
    //     to: to, 
    //     value: amountToSend, 
    //     gas: gas
    // })
    // await valueTransfer.fillTransaction();
    // await caver.wallet.sign(keyring.address, valueTransfer);

    // const rlpEncoded = valueTransfer.getRLPEncoding();
    // await caver.rpc.klay.sendRawTransaction(rlpEncoded);
}