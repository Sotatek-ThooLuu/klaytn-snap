// Change account address in-sync with metamask
// ethereum.on("accountsChanged", async (accounts) => {
//     address = accounts[0];
//     handleAccountChange();
// });

// Change network in-sync with metamask
// ethereum.on("chainChanged", async (_chainId) => {
//     console.log(`Change into ${_chainId}`);
//     handleAccountChange();
// });

let network = "baobab";
const snapId = `local:${window.location.href}`;

document.getElementById("connectButton").onclick = async () => {
    try {
        await ethereum.request({
            method: "wallet_enable",
            params: [{ wallet_snap: { [snapId]: {} } }],
        });

        const [address, balance] = await Promise.all([
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getAddress" }],
            }),
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [
                    snapId,
                    { method: "klay_getBalance", params: { network } },
                ],
            }),
        ]);

        document.getElementById("addressSpan").innerText = address;
        document.getElementById("balanceSpan").innerText = balance;
    } catch (err) {
        console.error("Connect error: " + err.message || err);
    }
};

// /* ----- Account ----- */
// const createFromRLPEncodingButton = document.querySelector(
//     "button.createFromRLPEncoding"
// );
// createFromRLPEncodingButton.addEventListener("click", async () => {
//     const rlpEncodedKey = document.getElementById("inputRlpEncoded").value;
//     try {
//         const account = await ethereum.request({
//             method: "wallet_invokeSnap",
//             params: [
//                 snapId,
//                 {
//                     method: "klay_createFromRLPEncoding",
//                     params: { address, network, rlpEncodedKey },
//                 },
//             ],
//         });
//         document.getElementById("RLPEncodingRes").innerText =
//             JSON.stringify(account);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

// const createWithAccountKeyLegacyButton = document.querySelector(
//     "button.createWithAccountKeyLegacy"
// );
// createWithAccountKeyLegacyButton.addEventListener("click", async () => {
//     try {
//         const account = await ethereum.request({
//             method: "wallet_invokeSnap",
//             params: [
//                 snapId,
//                 {
//                     method: "klay_createWithAccountKeyLegacy",
//                     params: { address, network },
//                 },
//             ],
//         });
//         document.getElementById("accountKeyLegacyRes").innerText =
//             JSON.stringify(account);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

// const createWithAccountKeyPublicButton = document.querySelector(
//     "button.createWithAccountKeyPublic"
// );
// createWithAccountKeyPublicButton.addEventListener("click", async () => {
//     const keyPublic = document.getElementById("inputKeyPublic").value;
//     try {
//         const account = await ethereum.request({
//             method: "wallet_invokeSnap",
//             params: [
//                 snapId,
//                 {
//                     method: "klay_createWithAccountKeyPublic",
//                     params: { address, network, keyPublic },
//                 },
//             ],
//         });
//         document.getElementById("accountKeyPublicRes").innerText =
//             JSON.stringify(account);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

// const createWithAccountKeyFailButton = document.querySelector(
//     "button.createWithAccountKeyFail"
// );
// createWithAccountKeyFailButton.addEventListener("click", async () => {
//     try {
//         const account = await ethereum.request({
//             method: "wallet_invokeSnap",
//             params: [
//                 snapId,
//                 {
//                     method: "klay_createWithAccountKeyFail",
//                     params: { address, network },
//                 },
//             ],
//         });
//         document.getElementById("accountKeyFailRes").innerText =
//             JSON.stringify(account);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

// const createWithAccountKeyWeightedMultiSigButton = document.querySelector(
//     "button.createWithAccountKeyWeightedMultiSig"
// );
// createWithAccountKeyWeightedMultiSigButton.addEventListener(
//     "click",
//     async () => {
//         const keyWeightedMultiSig = document.getElementById(
//             "inputKeyWeightedMultiSig"
//         ).value;
//         const publicKeyArray = keyWeightedMultiSig.split(",");
//         try {
//             const account = await ethereum.request({
//                 method: "wallet_invokeSnap",
//                 params: [
//                     snapId,
//                     {
//                         method: "klay_createWithAccountKeyWeightedMultiSig",
//                         params: { address, network, publicKeyArray },
//                     },
//                 ],
//             });
//             document.getElementById("accountKeyWeightedMultiSigRes").innerText =
//                 JSON.stringify(account);
//         } catch (err) {
//             console.error(err.message);
//         }
//     }
// );

// const createWithAccountKeyRoleBasedButton = document.querySelector(
//     "button.createWithAccountKeyRoleBased"
// );
// createWithAccountKeyRoleBasedButton.addEventListener("click", async () => {
//     const keyRoleBased = document.getElementById("inputKeyRoleBased").value;
//     const roledBasedPublicKeyArray = keyRoleBased
//         .split(";")
//         .map((publicKeyArray) => publicKeyArray.split(","));
//     try {
//         const account = await ethereum.request({
//             method: "wallet_invokeSnap",
//             params: [
//                 snapId,
//                 {
//                     method: "klay_createWithAccountKeyRoleBased",
//                     params: { address, network, roledBasedPublicKeyArray },
//                 },
//             ],
//         });
//         document.getElementById("accountKeyRoleBasedRes").innerText =
//             JSON.stringify(account);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

/* ----- Transaction ----- */
document.getElementById("sendButton").onclick = async () => {
    const to = document.getElementById("toAddressInput").value;
    const value = document.getElementById("amountInput").value;
    try {
        const receipt = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_sendTransaction",
                    params: { to, value, network },
                },
            ],
        });
        const balance = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                { method: "klay_getBalance", params: { network } },
            ],
        });
        document.getElementById("transactionReceiptCode").innerText =
            JSON.stringify(receipt);
        document.getElementById("balanceSpan").innerText = balance;
    } catch (err) {
        console.error(err.message);
    }
};

document.getElementById("signButton").onclick = async () => {
    const message = document.getElementById("messageInput").value;
    try {
        const signedMessage = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_signMessage",
                    params: { message, network },
                },
            ],
        });
        document.getElementById("signedMessageCode").innerText =
            JSON.stringify(signedMessage);
    } catch (error) {
        console.error(error.message);
    }
};
