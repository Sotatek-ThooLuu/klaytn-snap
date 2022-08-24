import Caver, { SingleKeyring } from "caver-js";

export function createKeyring(address: string, key: string, caver: Caver): SingleKeyring {
    return caver.wallet.keyring.create(address, key);
}