import { OnRpcRequestHandler } from "@metamask/snap-types";
import Caver from "caver-js";
import { getAddress, getKeyPair } from "./account";
import { getCaver } from "./caver";
import { EmptyMetamaskState, KeyPair, KlaytnNetwork } from "./interface";
import { getBalance } from "./rpc";
import { sendTransaction } from "./transaction";
import { signMessage } from "./wallet";
// import { signMessage } from "./wallet";

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
    const state = await wallet.request({
        method: "snap_manageState",
        params: ["get"],
    });

    if (!state) {
        await wallet.request({
            method: "snap_manageState",
            params: ["update", EmptyMetamaskState()],
        });
    }

    switch (request.method) {
        case "klay_config": {
            return EmptyMetamaskState();
        }

        case "klay_getAddress": {
            return getAddress();
        }

        case "klay_getBalance": {
            const network: KlaytnNetwork = request.params["network"];
            return await getBalance(network);
        }

        // // caver.account
        // case "klay_createFromRLPEncoding": {
        //     const address: string = request.params["address"];
        //     const network: KlaytnNetwork = request.params["network"];
        //     const rlpEncodedKey: string = request.params["rlpEncodedKey"];
        //     return await createFromRLPEncoding(
        //         address,
        //         rlpEncodedKey,
        //         getCaver(network)
        //     );
        // }

        // case "klay_createWithAccountKeyLegacy": {
        //     const address: string = request.params["address"];
        //     const network: KlaytnNetwork = request.params["network"];
        //     return await createWithAccountKeyLegacy(address, getCaver(network));
        // }

        // case "klay_createWithAccountKeyPublic": {
        //     const address: string = request.params["address"];
        //     const network: KlaytnNetwork = request.params["network"];
        //     const keyPublic = request.params["keyPublic"];
        //     return await createWithAccountKeyPublic(
        //         address,
        //         keyPublic,
        //         getCaver(network)
        //     );
        // }

        // case "klay_createWithAccountKeyFail": {
        //     const address: string = request.params["address"];
        //     const network: KlaytnNetwork = request.params["network"];
        //     return await createWithAccountKeyFail(address, getCaver(network));
        // }

        // case "klay_createWithAccountKeyWeightedMultiSig": {
        //     const address: string = request.params["address"];
        //     const network: KlaytnNetwork = request.params["network"];
        //     const publicKeyArray: string[] = request.params["publicKeyArray"];
        //     return await createWithAccountKeyWeightedMultiSig(
        //         address,
        //         publicKeyArray,
        //         getCaver(network)
        //     );
        // }

        // case "klay_createWithAccountKeyRoleBased": {
        //     const address: string = request.params["address"];
        //     const network: KlaytnNetwork = request.params["network"];
        //     const roledBasedPublicKeyArray: string[][] =
        //         request.params["roledBasedPublicKeyArray"];
        //     return await createWithAccountKeyRoleBased(
        //         address,
        //         roledBasedPublicKeyArray,
        //         getCaver(network)
        //     );
        // }

        // caver.transaction
        case "klay_sendTransaction": {
            const to: string = request.params["to"];
            const value: string = request.params["value"];
            const network: KlaytnNetwork = request.params["network"];

            return await sendTransaction(network, to, value);
        }

        case "klay_signMessage": {
            const network: KlaytnNetwork = request.params["network"];
            const message: string = request.params["message"];

            return await signMessage(network, message);
        }
        default:
            throw new Error("Method not supported");
    }
};
