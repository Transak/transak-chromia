import { Network } from './types';

export const networks: Record<string, Network> = {
  main: {
    transactionLink: signature => `https://explorer.chromia.com/mainnet/transaction/${signature}`,
    walletLink: address => `https://explorer.chromia.com/mainnet/wallet/${address}`,
    networkUrl: 'https://acala-rpc.dwellir.com',
    networkName: 'mainnet',
  },
  testnet: {
    transactionLink: signature => `https://explorer.chromia.com/testnet/transaction/${signature}`,
    walletLink: address => `https://explorer.chromia.com/testnet/wallet/${address}`,
    networkName: 'testnet',
    networkUrl: "https://node0.testnet.chromia.com:7740/"
  },
};

module.exports = { networks };
