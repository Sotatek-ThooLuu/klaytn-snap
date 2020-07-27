export interface GetPublicKeyRequest{
  method: "getPublicKey";
}

export interface GetAddressRequest {
  method: "getAddress";
}

export interface ExportSeedRequest {
  method: "exportPrivateKey";
}

export interface ConfigureRequest {
  method: "configure";
  params: {
    configuration: SnapConfig;
  };
}

export interface SignMessageRequest {
  method: "signMessage";
  params: {
    message: PartialMessage;
  };
}

export interface SignMessageRawRequest {
  method: "signMessageRaw";
  params: {
    message: string;
  };
}

export interface SendMessageRequest {
  method: "sendMessage";
  params: {
    signedMessage: SignedMessage;
  };
}

export interface GetBalanceRequest {
  method: "getBalance";
}

export interface GetMessagesRequest {
  method: "getMessages";
}

export type MetamaskFilecoinRpcRequest =
    GetPublicKeyRequest |
    GetAddressRequest |
    ExportSeedRequest |
    ConfigureRequest |
    GetBalanceRequest |
    GetMessagesRequest |
    SignMessageRequest |
    SignMessageRawRequest |
    SendMessageRequest;

type Method = MetamaskFilecoinRpcRequest["method"];

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: object[];
}

export interface GetPluginsRequest {
  method: "wallet_getPlugins";
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskFilecoinRpcRequest];
}

export type MetamaskRpcRequest = WalletEnableRequest | GetPluginsRequest | SnapRpcMethodRequest;

export type BlockId = number|string|"latest";

export interface TxPayload {
  tx: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface BlockInfo {
  hash: string;
  number: string;
}

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}

export interface SnapConfig {
  derivationPath: string;
  token: string;
  network: FilecoinNetwork;
  rpcUrl: string;
  unit?: UnitConfiguration;
}

export type Callback<T> = (arg: T) => void;

// Filecoin types

export interface Message {
  to: string;
  from: string;
  nonce: number;
  value: string;
  gasprice: string;
  gaslimit: number;
  method: number;
  params?: [];
}

export interface SignedMessage {
  message: Message;
  signature: {
    data: string;
    type: number;
  };
}

export interface PartialMessage {
  to: string;
  value: string;
  gaslimit?: number;
  gasprice?: string;
}

export interface MessageStatus {
  message: Message;
  serialized: string;
  block: {
    cid: string;
  };
}

export type FilecoinNetwork = "f" | "t";

export interface FilecoinEventApi {}

export interface FilecoinSnapApi {
  getPublicKey(): Promise<string>;
  getAddress(): Promise<string>;
  getBalance(): Promise<string>;
  exportPrivateKey(): Promise<string>;
  configure(configuration: Partial<SnapConfig>): Promise<void>;
  signMessage(message: PartialMessage): Promise<SignedMessage>;
  signMessageRaw(message: string): Promise<string>;
  sendMessage(signedMessage: SignedMessage): Promise<unknown>;
}

export interface KeyPair {
  address: string;
  privateKey: string;
  publicKey: string;
}