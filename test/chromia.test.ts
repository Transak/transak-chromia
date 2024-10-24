import ChromiaLib from '../src/index';
import { describe, expect, test } from '@jest/globals';
import * as dotenv from 'dotenv';

dotenv.config();

// variables
const mainTimeout = 14000;

// testData
const testData = {
  publicKey: process.env.MY_PUBLIC_KEY || 'F89709B5D05D6D29DC9F8EB92C36F22917998B7DFA9D375A125B8FBD56A739E6',
  privateKey: process.env.MY_PRIVATE_KEY || '',
  toWalletAddress: process.env.TOWALLETADDRESS || 'F89709B5D05D6D29DC9F8EB92C36F22917998B7DFA9D375A125B8FBD56A739E6',
  network: process.env.NETWORK || 'testnet',
  crypto: 'tCHR',
  amount: 0.5,
  decimals: 6,
  tokenAddress: '2af2053c9cfd1ba030e01ea501dfd86156bb6247e7981af93e3364b0d2c4f2ac',
  blockchainRid: "C7D5D9E5222E8AF3F13FE973581CAA78C7824E10D23A247C3DA9A5F7AA9E417F"
};

const keys = {
  sendTransactionResponse: [
    'amount',
    'date',
    'from',
    'gasCostCryptoCurrency',
    'network',
    'nonce',
    'to',
    'transactionHash',
    'transactionLink',
    'transactionReceipt',
  ],
  getTransactionResponse: [
    'date',
    'gasCostCryptoCurrency',
    'gasCostInCrypto',
    'gasLimit',
    'isPending',
    'isExecuted',
    'isSuccessful',
    'isFailed',
    'isInvalid',
    'network',
    'nonce',
    'transactionHash',
    'transactionLink',
  ],
};

const runtime = { transactionHash: '' };

describe('chromia module', () => {
  test(
    'should getBalance',
    async function () {
      const { network, decimals, tokenAddress, publicKey, blockchainRid } = testData;

      const result = await ChromiaLib.getBalance(
        network,
        publicKey,
        tokenAddress, // token Id
        blockchainRid
      );

      console.log({ result });
      expect(typeof result).toBe('number');
    },
    mainTimeout,
  );

  test(
    'should isValidWalletAddress',
    async function () {
      const result = await ChromiaLib.isValidWalletAddress(testData.toWalletAddress);

      console.log({ result });
      expect(result).toBe(true);
    },
    mainTimeout * 3,
  );

  test(
    'should sendTransaction',
    async function () {
      const { toWalletAddress: to, network, amount, decimals, privateKey, tokenAddress, blockchainRid, publicKey } = testData;

      const result = await ChromiaLib.sendTransaction({
        to,
        amount,
        network,
        decimals,
        privateKey,
        tokenAddress,
        blockchainRid,
        publicKey
      });

      console.log({ result });

      runtime.transactionHash = result.receipt.transactionHash;

      expect(Object.keys(result.receipt)).toEqual(expect.arrayContaining(keys.sendTransactionResponse));
    },
    mainTimeout * 3,
  );

  test(
    'should getTransaction',
    async function () {
      const { network, blockchainRid } = testData;
      const { transactionHash: txnId } = runtime;

      const result = await ChromiaLib.getTransaction(
        '5E227C45623DA6329801051A3890942171F0841824555CAB64A1C670B8E18F86',
        network,
        blockchainRid
      );
      console.log(result);

      if (result) expect(Object.keys(result.receipt)).toEqual(expect.arrayContaining(keys.getTransactionResponse));
    },
    mainTimeout * 3,
  );

  
  test(
    'should calculateNetworkFee',
    async function () {
      const { network, publicKey } = testData;

      const result = await ChromiaLib.getFeeStats(network, publicKey);

      console.log({ result });
      expect(typeof result.baseFee).toBe('number');
    },
    mainTimeout,
  );
});
