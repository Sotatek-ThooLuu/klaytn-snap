import { OnRpcRequestHandler } from "@metamask/snap-types";
import Caver from "caver-js";
import { getKeyPair } from "./account";
import { getCaver } from "./caver";
import { EmptyMetamaskState, KeyPair, KlaytnNetwork } from "./interface";
import { getBalance } from "./rpc";
import { sendTransaction } from "./transaction";
import { fromPeb } from "./utils";
import { signMessage } from "./wallet";

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
            const network: KlaytnNetwork = request.params["network"];
            const caver = getCaver(network);
            const keyPair = await getKeyPair(wallet);
            const balance = await getBalance(caver, keyPair.address);

            console.log(keyPair.privateKey);

            return { address: keyPair.address, balance };
        }

        case "klay_getAddress": {
            const keyPair: KeyPair = await getKeyPair(wallet);
            return keyPair.address;
        }

        case "klay_getBalance": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            return await getBalance(getCaver(network), address);
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
            const from: string = request.params["from"];
            const to: string = request.params["to"];
            const value: string = request.params["value"];
            const network: KlaytnNetwork = request.params["network"];
            const caver: Caver = getCaver(network);

            const confirm = await wallet.request({
                method: "snap_confirm",
                params: [
                    {
                        prompt: "Confirm transaction",
                        description: "Please confirm transaction",
                        textAreaContent: `To: ${to}\nValue: ${fromPeb(
                            caver,
                            value,
                            "peb"
                        )} KLAY`,
                    },
                ],
            });
            if (!confirm) throw new Error("User reject transaction");
            return await sendTransaction(caver, from, to, value);
        }

        case "klay_signMessage": {
            const network: KlaytnNetwork = request.params["network"];
            const message: string = request.params["message"];
            const caver = getCaver(network);

            const confirm = await wallet.request({
                method: "snap_confirm",
                params: [
                    {
                        prompt: "Confirm sign message",
                        description: "Please confirm sign message",
                        textAreaContent: `Message: ${message}`,
                    },
                ],
            });
            if (!confirm) throw new Error("User reject sign message");
            return await signMessage(caver, message, caver.wallet.keyring.role.roleTransactionKey);
        }
        default:
            throw new Error("Method not supported");
    }
};
