// eslint-disable-next-line boundaries/no-unknown-files
import axios from "axios";

export async function fundAddress(chainSimulatorUrl: string, address: string) {
  const payload = [
    {
      address: address,
      balance: '100000000000000000000000',
    },
  ];
  await axios.post(`${chainSimulatorUrl}/simulator/set-state`, payload);
}

export async function getNonce(chainSimulatorUrl: string, address: string): Promise<number> {
  try {
    const currentNonceResponse = await axios.get(`${chainSimulatorUrl}/address/${address}/nonce`);
    return currentNonceResponse.data.data.nonce;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

export async function sendTransaction(args: SendTransactionArgs): Promise<string> {
  try {
    const nonce = await getNonce(args.chainSimulatorUrl, args.sender);

    const tx = {
      sender: args.sender,
      receiver: args.receiver,
      nonce: nonce,
      value: args.value,
      gasPrice: 1000000000,
      gasLimit: args.gasLimit,
      data: args.dataField,
      signature: 'a'.repeat(128),
      chainID: 'chain',
      version: 1,
    };

    const txHashResponse = await axios.post(`${args.chainSimulatorUrl}/transaction/send`, tx);
    const txHash = txHashResponse.data.data.txHash;
    await axios.post(`${args.chainSimulatorUrl}/simulator/generate-blocks-until-transaction-processed/${txHash}`);
    return txHash;
  } catch (e) {
    console.error(e);
    return 'n/a';
  }
}

export class SendTransactionArgs {
  chainSimulatorUrl: string = '';
  sender: string = '';
  receiver: string = '';
  dataField: string = '';
  value?: string = '0';
  gasLimit?: number = 100_000_000;

  constructor(options: Partial<SendTransactionArgs> = {}) {
    Object.assign(this, options);
  }
}
