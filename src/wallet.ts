import Caver, { SignedMessage, SingleKeyring } from "caver-js";
import { getKeyPair } from "./account";
import { KeyPair } from "./interface";

export async function signMessage(
    caver: Caver,
    message: string,
    role: number,
    index?: number
): Promise<SignedMessage> {
    const keyPair: KeyPair = await getKeyPair(wallet);
    const keyring: SingleKeyring = createKeyring(
        caver,
        keyPair.address,
        keyPair.privateKey
    );
    caver.wallet.add(keyring);
    return caver.wallet.signMessage(keyPair.address, message, role, index);
}

export function createKeyring(
    caver: Caver,
    address: string,
    privateKey: string
): SingleKeyring {
    return caver.wallet.keyring.create(address, privateKey);
}
