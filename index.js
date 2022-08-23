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

const snapId = `local:${window.location.href}`;

const connectButton = document.querySelector("button.connect");
connectButton.addEventListener("click", async () => {
    try {
        await ethereum.request({
            method: "wallet_enable",
            params: [{ wallet_snap: { [snapId]: {} } }],
        });

        // get current metamask account
        // await ethereum
        //     .request({ method: "eth_requestAccounts" })
        //     .then((accounts) => {
        //         address = accounts[0];
        //         handleAccountChange();
        //     });

        // get current klaytn account
        const { address, balance, accountKey } = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId,
                {
                    method: "klay_config",
                    params: { network: "baobab" },
                },
            ],
        });

        document.getElementById("address").innerHTML = address;
        document.getElementById("balance").innerHTML = balance;
        document.getElementById("accountKey").innerHTML = JSON.stringify(accountKey);
    } catch (err) {
        console.error("Connect error: " + err.message || err);
    }
});

/* ----- Account ----- */
const createFromRLPEncodingButton = document.querySelector("button.createFromRLPEncoding");
createFromRLPEncodingButton.addEventListener("click", async () => {
    const rlpEncodedKey = document.getElementById("inputRlpEncoded").value;
    try {
        const receipt = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                snapId, 
                { method: "klay_createFromRLPEncoding", params: [ rlpEncodedKey ] }
            ],
        });
        console.log("63 =====", receipt);

        const [balance, accountKey] = await Promise.all([
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getBalance" }],
            }),
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getAccountKey" }],
            }),
        ]);
        document.getElementById("balance").innerHTML = balance;
        document.getElementById("accountKey").innerHTML = JSON.stringify(accountKey);
    } catch (err) {
        console.error(err.message);
    }
})

const createWithAccountKeyLegacyButton = document.querySelector("button.createWithAccountKeyLegacy");
createWithAccountKeyLegacyButton.addEventListener("click", async () => {
    try {
        const receipt = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [snapId, { method: "klay_createWithAccountKeyLegacy" }],
        });
        console.log("89 =====", receipt);

        const [balance, accountKey] = await Promise.all([
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getBalance" }],
            }),
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getAccountKey" }],
            }),
        ]);
        document.getElementById("balance").innerHTML = balance;
        document.getElementById("accountKey").innerHTML = JSON.stringify(accountKey);
    } catch (err) {
        console.error(err.message);
    }
});

const createWithAccountKeyPublicButton = document.querySelector("button.createWithAccountKeyPublic");
createWithAccountKeyPublicButton.addEventListener("click", async () => {
    const keyPublic = document.getElementById("inputKeyPublic").value;
    try {
        const receipt = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [snapId, { method: "klay_createWithAccountKeyPublic", params: { keyPublic } }],
        });
        console.log("116 =====", receipt);

        const [balance, accountKey] = await Promise.all([
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getBalance" }],
            }),
            ethereum.request({
                method: "wallet_invokeSnap",
                params: [snapId, { method: "klay_getAccountKey" }],
            }),
        ]);
        document.getElementById("balance").innerHTML = balance;
        document.getElementById("accountKey").innerHTML = JSON.stringify(accountKey);
    } catch (err) {
        console.error(err.message);
    }
});
