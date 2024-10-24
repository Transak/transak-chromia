import {
  createAmount,
  createKeyStoreInteractor,
  createConnection,
  gtv,
  createAmountFromBalance,
  createInMemoryEvmKeyStore,
} from "@chromia/ft4";
import { createClient, encryption, newSignatureProvider } from "postchain-client";
import { networks } from './config';
import { Network, GetTransactionResult, SendTransactionResult, SendTransactionParams, getFeeStatsResult } from './types';


const createChromiaClient = async (network: string, blockchainRid: string) => {

  const networkInfo = getNetwork(network)
  const nodeUrl = networkInfo.networkUrl
  const chromiaClient = await createClient({
    nodeUrlPool: nodeUrl,
    blockchainRid: blockchainRid,
  });

  return chromiaClient
}

/**
 * Get the network config
 * @param network
 * @returns
 */
const getNetwork = (network: string) => (network === 'main' ? networks[network] : networks.testnet) as Network;

/**
 * Validate the wallet address
 * @param address
 * @returns
 */
const isValidWalletAddress = async (address: string) => {
  // validate chromia address
  try {
    const hashRegex = /^[a-fA-F0-9]+$/;
    const validAddress = hashRegex.test(address) && address.length >= 40 && address.length <= 64
    return validAddress
  } catch (error) {
    return false;
  }
};

/**
 *
 * @param txId
 * @param network
 * @returns
 */
const getTransactionLink = (txId: string, network: string) => getNetwork(network).transactionLink(txId) as string;

/**
 * get wallet link for the given address
 * @param walletAddress
 * @param network
 * @returns
 */
const getWalletLink = (walletAddress: string, network: string) => getNetwork(network).walletLink(walletAddress) as string;


/**
 * Get the balance of the transak wallet address
 * @param network
 * @param privateKey
 * @param tokenAddress // tokenAddress
 * @returns
 */
async function getBalance(network: string, publicKey: string, tokenAddress: string, blockchainRid: string): Promise<any> {
  const chromiaClient = await createChromiaClient(network, blockchainRid)
  const connection = createConnection(chromiaClient);
  const account = await connection.getAccountById(publicKey);
  if (!account) {
    throw new Error("Invalid account")
  }
  const balances = await account.getBalanceByAssetId(tokenAddress)
  const balanceAmount = balances?.amount.value
  if (!balanceAmount) return 0
  const balanceValue = createAmountFromBalance(balanceAmount, balances?.amount.decimals)
  const valueInNumber = Number(balanceValue.value) / (10 ** balanceValue.decimals);
  return valueInNumber
}

/**
 * Get the transaction details by transaction id
 * @param txnId
 * @param network
 * @returns
 */
async function getTransaction(txnId: string, network: string, blockchainRid: string): Promise<GetTransactionResult | null> {
  try {
    const chromiaClient = await createChromiaClient(network, blockchainRid)
    const transactionBuffer = Buffer.from(txnId, 'hex');
    const transactionStatus = await chromiaClient.getTransactionStatus(transactionBuffer)
    let transactionData: any
    // if status is confirmed then fetch details
    if (transactionStatus.status === "confirmed") {
      transactionData = await chromiaClient.getTransactionInfo(transactionBuffer)
    }
    return {
      transactionData: JSON.parse(JSON.stringify(transactionData)),
      receipt: {
        from: '',
        date: transactionData.timestamp,
        gasCostCryptoCurrency: 'CHR',
        gasCostInCrypto: 0,
        gasLimit: 0,
        isPending: transactionStatus.status === "waiting",
        isExecuted: true,
        isSuccessful: transactionStatus.status === "confirmed",
        isFailed: transactionStatus.status === "rejected",
        isInvalid: false,
        network,
        nonce: 0,
        transactionHash: txnId,
        transactionLink: getTransactionLink(txnId, network),
      },
    };
  } catch (error) {
    console.info(`Error fetching transaction details:, ${error}`);
    return null
  }
}


/**
 * Send the transaction to the chromia network
 * @param param0
 * @returns
 */
async function sendTransaction({ to, amount, network, privateKey, decimals, tokenAddress, publicKey, blockchainRid }: SendTransactionParams): Promise<SendTransactionResult> {
  const chromiaClient = await createChromiaClient(network, blockchainRid)
  const senderKeyPair = encryption.makeKeyPair(privateKey);
  const senderId = publicKey

  const recipientId = Buffer.from(to, 'hex');
  const assetId = Buffer.from(tokenAddress, 'hex');
  const amountToSend = createAmount(amount, decimals); 
  const { getSession } = createKeyStoreInteractor(chromiaClient, createInMemoryEvmKeyStore(senderKeyPair));
  const session = await getSession(senderId);
  const trasferDetails = await session.account.transfer(recipientId, assetId, amountToSend);
  const transactionHash = Buffer.from(trasferDetails.receipt.transactionRid).toString('hex')
  return {
    transactionData: { trasferDetails },
    receipt: {
      amount,
      date: null,
      from: publicKey,
      gasCostCryptoCurrency: 'CHR',
      transactionReceipt: trasferDetails,
      network,
      nonce: 0,
      to,
      transactionHash: transactionHash,
      transactionLink: getTransactionLink(transactionHash, network),
    },
  };
}

async function getFeeStats(network: string, publicKey: string): Promise<getFeeStatsResult> {

  return {
    feeCryptoCurrency: 'CHR',
    baseFee: 0,
    lowFeeCharged: 0,
    standardFeeCharged: 0,
    fastFeeCharged: 0,
    maxFeeCharged: 0,
  };
}

export = {
  getTransactionLink,
  getWalletLink,
  getTransaction,
  isValidWalletAddress,
  sendTransaction,
  getBalance,
  getFeeStats,
};
