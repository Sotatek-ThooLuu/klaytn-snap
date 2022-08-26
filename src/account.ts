import {
    getBIP44AddressKeyDeriver,
    JsonBIP44CoinTypeNode,
} from "@metamask/key-tree";
import { SnapProvider } from "@metamask/snap-types";
import { KeyPair, MetamaskState } from "./interface";

export async function getKeyPair(wallet: SnapProvider): Promise<KeyPair> {
    const state = (await wallet.request({
        method: "snap_manageState",
        params: ["get"],
    })) as MetamaskState;
    const derivationPath = state.klaytn.config;
    const [, , coinType, account, change, addressIndex] =
        derivationPath.split("/");
    const bip44Code = coinType.replace("'", "");
    const bip44Node = (await wallet.request({
        method: `snap_getBip44Entropy_${bip44Code}`,
    })) as JsonBIP44CoinTypeNode;

    const addressKeyDeriver = await getBIP44AddressKeyDeriver(bip44Node, {
        account: parseInt(account),
        change: parseInt(change),
    });
    const addressKey = await addressKeyDeriver(parseInt(addressIndex));

    return {
        address: addressKey.address,
        privateKey: addressKey.privateKey,
        publicKey: addressKey.publicKey,
    };
}
