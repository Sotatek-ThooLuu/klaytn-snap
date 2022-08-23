import { OnRpcRequestHandler } from "@metamask/snap-types";
import Caver, { Account, AccountUpdate } from "caver-js";
import { createFromRLPEncoding } from "./account/createFromRLPEncoding";
import { createWithAccountKeyLegacy } from "./account/createWithAccountKeyLegacy";
import { createWithAccountKeyPublic } from "./account/createWithAccountKeyPublic";
import { getKeyPair } from "./account/getKeyPair";
import { EmptyMetamaskState, KeyPair, KlaytnNetwork } from "./interface";
import { createKeyring } from "./keyring/createKeyring";
import { getAccountKey } from "./rpc/getAccountKey";
import { getBalance } from "./rpc/getBalance";
import { sendTransaction } from "./rpc/sendTransaction";
import { accountUpdate } from "./transaction/accountUpdate";
import { getCaver } from "./utils";

let caver: Caver;
let keyPair: KeyPair;

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
            caver = getCaver(network);
            keyPair = await getKeyPair(wallet);
            const [balance, accountKey] = await Promise.all([
                getBalance(keyPair.address, caver),
                getAccountKey(keyPair.address, caver),
            ]);
            createKeyring(keyPair.address, keyPair.privateKey, caver);

            return { address: keyPair.address, balance, accountKey };
        }

        case "klay_getBalance": {
            return await getBalance(keyPair.address, caver);
        }

        case "klay_getAccountKey": {
            return await getAccountKey(keyPair.address, caver);
        }

        // caver.account
        case "klay_createFromRLPEncoding": {
            const rlpEncodedKey: string = request.params["rlpEncodedKey"];
            const account: Account = await createFromRLPEncoding(keyPair.address, rlpEncodedKey, caver);
            console.log("55 =====", account);
            
            const accountUpdated: AccountUpdate = await accountUpdate(keyPair.address, account, caver);
            const confirm = await wallet.request({
                method: "snap_confirm",
                params: [
                    {
                        prompt: "Update account",
                        description: "Update account with RLP Encoded",
                        textAreaContent: JSON.stringify(accountUpdated),
                    },
                ],
            });
            if (!confirm) throw new Error('User reject transaction');
            await caver.wallet.sign(keyPair.address, accountUpdated);
            const rlpEncoded = accountUpdated.getRLPEncoding();

            return await sendTransaction(rlpEncoded, caver);
        }

        case "klay_createWithAccountKeyLegacy": {
            const account: Account = await createWithAccountKeyLegacy(keyPair.address, caver);
            const accountUpdated: AccountUpdate = await accountUpdate(keyPair.address, account, caver);
            const confirm = await wallet.request({
                method: "snap_confirm",
                params: [
                    {
                        prompt: "Update account",
                        description: "Update account with key public",
                        textAreaContent: JSON.stringify(accountUpdated),
                    },
                ],
            });

            if (!confirm) throw new Error('User reject transaction');
            await caver.wallet.sign(keyPair.address, accountUpdated);

            const rlpEncoded = accountUpdated.getRLPEncoding();
            return await sendTransaction(rlpEncoded, caver);
        }

        case "klay_createWithAccountKeyPublic": {
            const keyPublic = request.params['keyPublic'];
            const account: Account = await createWithAccountKeyPublic(keyPair.address, keyPublic, caver);
            const accountUpdated: AccountUpdate = await accountUpdate(keyPair.address, account, caver);
            const confirm = await wallet.request({
                method: "snap_confirm",
                params: [
                    {
                        prompt: "Update account",
                        description: "Update account with key legacy",
                        textAreaContent: JSON.stringify(accountUpdated),
                    },
                ],
            });

            if (!confirm) throw new Error('User reject transaction');
            await caver.wallet.sign(keyPair.address, accountUpdated);

            const rlpEncoded = accountUpdated.getRLPEncoding();
            return await sendTransaction(rlpEncoded, caver);
        }

        default:
            break;
    }
};
