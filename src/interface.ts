import { defaultConfig } from "./config/predefine";

export type KlaytnNetwork = "cypress" | "baobab";

export type MetamaskState = {
    klaytn: {
        config: string;
    };
};

export type KeyPair = {
    address: string;
    privateKey: string;
    publicKey: string;
}

export const EmptyMetamaskState: () => MetamaskState = () => ({
    klaytn: { config: defaultConfig },
});
