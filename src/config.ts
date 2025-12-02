import { Network } from './types';

const NODE_URL_POOL = [
    "https://system.chromaway.com:7740", 
    "https://chromia.validatrium.club",
    "https://chromia-mainnet-systemnode-1.stakin-nodes.com:7740",
    "https://chroma.node.monster:7741",
    "https://chromia.mainnet-system.nodeops.ninja:7740"
]

export const networks: Record<string, Network> = {
  main: {
    transactionLink: (signature, blockchainRid) => `https://explorer.chromia.com/mainnet/transaction/${blockchainRid}/${signature}`,
    walletLink: address => `https://explorer.chromia.com/mainnet/wallet/${address}`,
    networkUrl: 'https://system.chromaway.com/',
    networkName: 'mainnet',
    directoryNodeUrlPool: NODE_URL_POOL
  },
  testnet: {
    transactionLink: (signature, blockchainRid) => `https://explorer.chromia.com/testnet/transaction/${blockchainRid}/${signature}`,
    walletLink: address => `https://explorer.chromia.com/testnet/wallet/${address}`,
    networkName: 'testnet',
    networkUrl: "https://node0.testnet.chromia.com:7740/"
  },
};

module.exports = { networks };
