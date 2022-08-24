import { OnRpcRequestHandler } from "@metamask/snap-types";
import Caver, { Account, SingleKeyring, ValueTransfer } from "caver-js";
import { createFromRLPEncoding } from "./account/createFromRLPEncoding";
import { createWithAccountKeyFail } from "./account/createWithAccountKeyFail";
import { createWithAccountKeyLegacy } from "./account/createWithAccountKeyLegacy";
import { createWithAccountKeyPublic } from "./account/createWithAccountKeyPublic";
import { createWithAccountKeyRoleBased } from "./account/createWithAccountKeyRoleBased";
import { createWithAccountKeyWeightedMultiSig } from "./account/createWithAccountKeyWeightedMultiSig";
import { getKeyPair } from "./account/getKeyPair";
import { EmptyMetamaskState, KeyPair, KlaytnNetwork } from "./interface";
import { createKeyring } from "./keyring/createKeyring";
import { getBalance } from "./rpc/getBalance";
import { createTransactionObject } from "./transaction/createTransactionObject";
import { getCaver } from "./utils";

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
            const balance = await getBalance(keyPair.address, caver);

            console.log(keyPair.privateKey);
            
            return { address: keyPair.address, balance };
        }

        case "klay_getBalance": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            return await getBalance(address, getCaver(network));
        }

        // caver.account
        case "klay_createFromRLPEncoding": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            const rlpEncodedKey: string = request.params["rlpEncodedKey"];
            return await createFromRLPEncoding(
                address,
                rlpEncodedKey,
                getCaver(network)
            );
        }

        case "klay_createWithAccountKeyLegacy": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            return await createWithAccountKeyLegacy(address, getCaver(network));
        }

        case "klay_createWithAccountKeyPublic": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            const keyPublic = request.params["keyPublic"];
            return await createWithAccountKeyPublic(
                address,
                keyPublic,
                getCaver(network)
            );
        }

        case "klay_createWithAccountKeyFail": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            return await createWithAccountKeyFail(address, getCaver(network));
        }

        case "klay_createWithAccountKeyWeightedMultiSig": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            const publicKeyArray: string[] = request.params["publicKeyArray"];
            return await createWithAccountKeyWeightedMultiSig(
                address,
                publicKeyArray,
                getCaver(network)
            );
        }

        case "klay_createWithAccountKeyRoleBased": {
            const address: string = request.params["address"];
            const network: KlaytnNetwork = request.params["network"];
            const roledBasedPublicKeyArray: string[][] =
                request.params["roledBasedPublicKeyArray"];
            return await createWithAccountKeyRoleBased(
                address,
                roledBasedPublicKeyArray,
                getCaver(network)
            );
        }

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
                        textAreaContent: `To: ${to}\nValue: ${caver.utils.fromPeb(value, 'KLAY')} KLAY`,
                    },
                ],
            });
            if (!confirm) throw new Error("User reject transaction");
            
            const keyPair: KeyPair = await getKeyPair(wallet);
            const keyring: SingleKeyring = caver.wallet.keyring.create(keyPair.address, keyPair.privateKey);
            caver.wallet.add(keyring);

            const valueTransfer: ValueTransfer = await createTransactionObject(
                { from, to, value }, caver
            );
            await caver.wallet.sign(keyring.address, valueTransfer);
            // valueTransfer.sign(createKeyring(from, keyPair.privateKey, caver));
            return await caver.rpc.klay.sendRawTransaction(valueTransfer.getRLPEncoding());
        }

        default:
            throw new Error("Method not supported");
    }
};
