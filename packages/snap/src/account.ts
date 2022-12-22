import {
    getBIP44AddressKeyDeriver,
    JsonBIP44CoinTypeNode,
} from "@metamask/key-tree";
import Caver, { Account } from "caver-js";
import { getCaver } from "./caver";
import { KeyPair, KlaytnNetwork, MetamaskState } from "./interface";

export async function getKeyPair(): Promise<KeyPair> {
    const state = (await wallet.request({
        method: "snap_manageState",
        params: ["get"],
    })) as MetamaskState;
    const derivationPath = state.klaytn.derivationPath;
    const [, , coinType, account, change, addressIndex] =
        derivationPath.split("/");
    const bip44Code = Number(coinType.replace("'", ""));
    console.log(`-bip44:`, bip44Code)
    const bip44Node = (await wallet.request({
        method: 'snap_getBip44Entropy',
        params: {
            coinType: bip44Code,
        },
    })) as JsonBIP44CoinTypeNode;

    const addressKeyDeriver = await getBIP44AddressKeyDeriver(bip44Node, {
        account: parseInt(account),
        change: parseInt(change),
    });
    console.log(`=25`, addressKeyDeriver)

    const addressKey = await addressKeyDeriver(parseInt(addressIndex));

    return {
        address: addressKey.address,
        privateKey: addressKey.privateKey,
        publicKey: addressKey.publicKey,
    };
}

export async function getAddress() {
    const keyPair: KeyPair = await getKeyPair();
    return keyPair.address;
}

export async function createFromRLPEncoding(
    network: KlaytnNetwork,
    rlpEncodedKey: string
): Promise<Account> {
    const caver: Caver = getCaver(network);
    const address: string = await getAddress();
    const confirm = await wallet.request({
        method: "snap_confirm",
        params: [
            {
                prompt: "Confirm",
                description: "Creates an Account instance from RLP-encoded AccountKey.",
                textAreaContent: `Creates an Account instance from RLP-encoded AccountKey with this rlpEncodedKey?
                ${rlpEncodedKey}`,
            },
        ],
    });

    if (!confirm) throw new Error("User rejected transaction");
    const result = caver.account.createFromRLPEncoding(address, rlpEncodedKey);
    return JSON.parse(JSON.stringify(result)); 
}

export async function createWithAccountKeyFail(
    network: KlaytnNetwork
): Promise<Account> {
    const caver: Caver = getCaver(network);
    const address: string = await getAddress();
    return caver.account.createWithAccountKeyFail(address);
}

export async function createWithAccountKeyLegacy(
    network: KlaytnNetwork
): Promise<Account> {
    const caver: Caver = getCaver(network);
    const address: string = await getAddress();
    const confirm = await wallet.request({
        method: "snap_confirm",
        params: [
            {
                prompt: "Confirm",
                description: "Creates an Account instance which has AccountKeyLegacy as an accountKey.",
                textAreaContent: `Creates an Account instance which has AccountKeyLegacy as an accountKey with this address?`,
            },
        ],
    });

    if (!confirm) throw new Error("User rejected transaction");
    const result = caver.account.createWithAccountKeyLegacy(address);
    return JSON.parse(JSON.stringify(result)); 
}

export async function createWithAccountKeyPublic(
    network: KlaytnNetwork,
    publicKey: string
): Promise<Account> {
    const caver: Caver = getCaver(network);
    const address: string = await getAddress();
    const confirm = await wallet.request({
        method: "snap_confirm",
        params: [
            {
                prompt: "Confirm",
                description: "Creates an Account instance which has AccountKeyPublic as an accountKey.",
                textAreaContent: `Creates an Account instance which has AccountKeyPublic as an accountKey with following parameters?
                - public key: ${publicKey}`,
            },
        ],
    });

    if (!confirm) throw new Error("User rejected transaction");
    const result = caver.account.createWithAccountKeyPublic(address, publicKey);
    return JSON.parse(JSON.stringify(result)); 
}

export async function createWithAccountKeyRoleBased(
    network: KlaytnNetwork,
    roledBasedPublicKeyArray: string[][]
): Promise<Account> {
    const caver: Caver = getCaver(network);
    const address: string = await getAddress();
    return caver.account.createWithAccountKeyRoleBased(
        address,
        roledBasedPublicKeyArray
    );
}

export async function createWithAccountKeyWeightedMultiSig(
    network: KlaytnNetwork,
    publicKeyArray: string[]
): Promise<Account> {
    const caver: Caver = getCaver(network);
    const address: string = await getAddress();
    return caver.account.createWithAccountKeyWeightedMultiSig(
        address,
        publicKeyArray
    );
}
