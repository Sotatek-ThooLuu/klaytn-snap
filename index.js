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

let address = "";
let network = "baobab";
const snapId = `local:${window.location.href}`;

const connectButton = document.querySelector("button.connect");
connectButton.addEventListener("click", async () => {
    try {
        await ethereum.request({
            method: "wallet_enable",
            params: [{ wallet_snap: { [snapId]: {} } }],
        });

        const resp = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [snapId, { method: "klay_config", params: { network } }],
        });

        address = resp.address;
        document.getElementById("address").innerText = address;
        document.getElementById("balance").innerText = resp.balance;
    } catch (err) {
        console.error("Connect error: " + err.message || err);
    }
});

/* ----- Account ----- */
const createFromRLPEncodingButton = document.querySelector(
    "button.createFromRLPEncoding"
);
createFromRLPEncodingButton.addEventListener("click", async () => {
    const rlpEncodedKey = document.getElementById("inputRlpEncoded").value;
    try {
        const account = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_createFromRLPEncoding",
                    params: { address, network, rlpEncodedKey },
                },
            ],
        });
        document.getElementById("RLPEncodingRes").innerText =
            JSON.stringify(account);
    } catch (err) {
        console.error(err.message);
    }
});

const createWithAccountKeyLegacyButton = document.querySelector(
    "button.createWithAccountKeyLegacy"
);
createWithAccountKeyLegacyButton.addEventListener("click", async () => {
    try {
        const account = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_createWithAccountKeyLegacy",
                    params: { address, network },
                },
            ],
        });
        document.getElementById("accountKeyLegacyRes").innerText =
            JSON.stringify(account);
    } catch (err) {
        console.error(err.message);
    }
});

const createWithAccountKeyPublicButton = document.querySelector(
    "button.createWithAccountKeyPublic"
);
createWithAccountKeyPublicButton.addEventListener("click", async () => {
    const keyPublic = document.getElementById("inputKeyPublic").value;
    try {
        const account = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_createWithAccountKeyPublic",
                    params: { address, network, keyPublic },
                },
            ],
        });
        document.getElementById("accountKeyPublicRes").innerText =
            JSON.stringify(account);
    } catch (err) {
        console.error(err.message);
    }
});

const createWithAccountKeyFailButton = document.querySelector(
    "button.createWithAccountKeyFail"
);
createWithAccountKeyFailButton.addEventListener("click", async () => {
    try {
        const account = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_createWithAccountKeyFail",
                    params: { address, network },
                },
            ],
        });
        document.getElementById("accountKeyFailRes").innerText =
            JSON.stringify(account);
    } catch (err) {
        console.error(err.message);
    }
});

const createWithAccountKeyWeightedMultiSigButton = document.querySelector(
    "button.createWithAccountKeyWeightedMultiSig"
);
createWithAccountKeyWeightedMultiSigButton.addEventListener(
    "click",
    async () => {
        const keyWeightedMultiSig = document.getElementById(
            "inputKeyWeightedMultiSig"
        ).value;
        const publicKeyArray = keyWeightedMultiSig.split(",");
        try {
            const account = await ethereum.request({
                method: "wallet_invokeSnap",
                params: [
                    snapId,
                    {
                        method: "klay_createWithAccountKeyWeightedMultiSig",
                        params: { address, network, publicKeyArray },
                    },
                ],
            });
            document.getElementById("accountKeyWeightedMultiSigRes").innerText =
                JSON.stringify(account);
        } catch (err) {
            console.error(err.message);
        }
    }
);

const createWithAccountKeyRoleBasedButton = document.querySelector(
    "button.createWithAccountKeyRoleBased"
);
createWithAccountKeyRoleBasedButton.addEventListener("click", async () => {
    const keyRoleBased = document.getElementById("inputKeyRoleBased").value;
    const roledBasedPublicKeyArray = keyRoleBased
        .split(";")
        .map((publicKeyArray) => publicKeyArray.split(","));
    try {
        const account = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_createWithAccountKeyRoleBased",
                    params: { address, network, roledBasedPublicKeyArray },
                },
            ],
        });
        document.getElementById("accountKeyRoleBasedRes").innerText =
            JSON.stringify(account);
    } catch (err) {
        console.error(err.message);
    }
});

/* ----- Transaction ----- */
const sendTransactionButton = document.querySelector("button.sendTransaction");
sendTransactionButton.addEventListener("click", async () => {
    const to = document.getElementById("inputToAddress").value;
    const value = document.getElementById("inputAmount").value;
    try {
        const receipt = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_sendTransaction",
                    params: { from: address, to, value, network },
                },
            ],
        });
        const balance = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                { method: "klay_getBalance", params: { address, network } },
            ],
        });
        document.getElementById("transactionReceipt").innerText =
            JSON.stringify(receipt);
        document.getElementById("balance").innerText = balance;
    } catch (err) {
        console.error(err.message);
    }
});

const signMessageButton = document.querySelector("button.signMessage");
signMessageButton.addEventListener("click", async () => {
    const message = document.getElementById("inputMessage").value;
    try {
        const receipt = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_signMessage",
                    params: { message, network },
                },
            ],
        });
        document.getElementById("transactionReceipt").innerText = JSON.stringify(receipt);
    } catch (err) {
        console.error(err.message);
    }
});
