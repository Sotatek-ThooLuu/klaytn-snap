// import {
//   BIP44Node,
//   getBIP44AddressKeyDeriver,
//   JsonBIP44CoinTypeNode,
// } from '@metamask/key-tree';
import { OnRpcRequestHandler } from '@metamask/snap-types';
// import { Account, AccountKey } from 'caver-js';
import { getBalance, sendToken } from './caverHelper';

// let account: BIP44Node;

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    // case 'klay_getAddress':
    //   const coinNode = (await wallet.request({ method: 'snap_getBip44Entropy_8217' })) as JsonBIP44CoinTypeNode;
    //   const deriveCoinNode = await getBIP44AddressKeyDeriver(coinNode);
    //   account = await deriveCoinNode(0);
    //   return account.address;

    case 'klay_getBalance':
      const address: string = request.params['address'];
      return await getBalance(address);

    case 'klay_sendToken':
    //   if (!account) return false;
      const from = request.params['from'];
      const to = request.params['to'];
      const value = request.params['value'];

      const confirm = await wallet.request({
        method: 'snap_confirm',
        params: [{
          prompt: 'Confirm transaction',
          description: 'Please confirm transaction',
          textAreaContent: `From: ${from}\nTo: ${to}\nValue: ${value} KLAY`
        }]
      });

      if (confirm) {
        console.log("40 ===== Before send");
        await sendToken(from, to, value);
        console.log("42 ===== After send");
        return true;
      }
      return false;
    default:
      break;
  }
};
