import Caver from "caver-js";

export async function signMessage(
  caver: Caver,
  address: string,
  message: string,
  role: number,
  index?: number
) {
  return await caver.wallet.signMessage(
    address,
    message,
    role,
    index,
  );
}
