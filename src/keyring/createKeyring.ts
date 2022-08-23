import Caver, { SingleKeyring } from "caver-js";

export function createKeyring(address: string, key: string, caver: Caver): void {
    const keyring: SingleKeyring = caver.wallet.keyring.create(address, key);
    caver.wallet.add(keyring);
}