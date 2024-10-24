# Chromia Client SDK

This package provides a client interface for interacting with the Chromia blockchain network. It includes methods to manage accounts, send transactions, retrieve transaction details, and check balances.

## Installation

To install the necessary dependencies, run:

```bash
npm install @transak/transak-chromia
```

## Usage

### 1. Validate Wallet Address

To validate whether a wallet address is in the correct format:

```typescript
const walletAddress = "wallet_address";
const isValid = await isValidWalletAddress(walletAddress);
console.log(`Is the wallet address valid? ${isValid}`);
```

### 2. Get Transaction Link

To generate a link to view a transaction on the explorer:

```typescript
const txId = "transaction_id";
const network = "main"; // or "testnet"
const transactionLink = getTransactionLink(txId, network);
console.log(`Transaction link: ${transactionLink}`);
```

### 3. Get Wallet Link

To generate a link to view a wallet on the explorer:

```typescript
const walletAddress = "wallet_address";
const network = "main"; // or "testnet"
const walletLink = getWalletLink(walletAddress, network);
console.log(`Wallet link: ${walletLink}`);
```

### 4. Get Balance

Retrieve the balance of a specific token for a public key (wallet address):

```typescript
const network = "main"; // or "testnet"
const publicKey = "public_key";
const tokenAddress = "token_address";
const blockchainRid = "blockchain_rid";
const balance = await getBalance(network, publicKey, tokenAddress, blockchainRid);
console.log(`Balance: ${balance}`);
```

### 5. Get Transaction Details

To get the details of a specific transaction using its transaction ID (`txnId`):

```typescript
const txnId = "transaction_id";
const network = "main"; // or "testnet"
const blockchainRid = "blockchain_rid";
const transactionDetails = await getTransaction(txnId, network, blockchainRid);
console.log(`Transaction details:`, transactionDetails);
```

### 6. Send Transaction

To send a transaction on the Chromia network, providing the `to` address, amount, network details, and keys:

```typescript
const transactionResult = await sendTransaction({
  to: "recipient_wallet_address",
  amount: 10, // amount to send
  network: "main", // or "testnet"
  decimals: 6, // decimal places for the token
  privateKey: "private_key",
  tokenAddress: "token_address",
  publicKey: "public_key",
  blockchainRid: "blockchain_rid",
});
console.log(`Transaction sent:`, transactionResult);
```

### 7. Get Fee Stats

To retrieve fee information for transactions on the network:

```typescript
const network = "main"; // or "testnet"
const publicKey = "public_key";
const feeStats = await getFeeStats(network, publicKey);
console.log(`Fee stats:`, feeStats);
```

## Configuration

Network information is managed using a `config.ts` file. It should define the available networks (`main`, `testnet`, etc.) with their respective URLs and blockchain resource IDs.

```typescript
export const networks =  {
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
```

## Types

### `Network`

This type defines the structure of the network configuration used to interact with Chromia.

```typescript
export type Network = {
  networkName: string;
  transactionLink: (arg0: string) => string;
  walletLink: (arg0: string) => string;
  networkUrl: string;
};
```

- `networkName`: The name of the network (e.g., `main`, `testnet`).
- `transactionLink`: A function that generates a link to view a transaction on the explorer.
- `walletLink`: A function that generates a link to view a wallet on the explorer.
- `networkUrl`: The base URL of the Chromia node.

### `GetTransactionResult`

This type is returned when fetching details about a transaction.

```typescript
export type GetTransactionResult = {
  transactionData: any;
  receipt: {
    date: Date | null;
    from: string;
    gasCostCryptoCurrency: string;
    gasCostInCrypto: number;
    gasLimit: number;
    isPending: boolean;
    isExecuted: boolean;
    isSuccessful: boolean;
    isFailed: boolean;
    isInvalid: boolean;
    network: string;
    nonce: number;
    transactionHash: string;
    transactionLink: string;
  };
};
```

- `transactionData`: Raw transaction details.
- `receipt`: Contains details about the transaction's execution status, such as whether it was successful, pending, or failed.

### `SendTransactionParams`

This type defines the parameters required to send a transaction.

```typescript
export type SendTransactionParams = {
  to: string;
  amount: number;
  network: string;
  decimals: number;
  privateKey: string;
  tokenAddress: string;
  publicKey: string;
  blockchainRid: string;
};
```

- `to`: Recipient wallet address.
- `amount`: Amount to send.
- `network`: The network on which the transaction will be sent.
- `decimals`: Decimal places for the token being transacted.
- `privateKey`: The private key of the sender.
- `tokenAddress`: The token’s asset ID.
- `publicKey`: The sender's public key.
- `blockchainRid`: Blockchain resource ID. This is the chain on which token will be sent since chromia is a chain of chains

### `SendTransactionResult`

This type is returned when a transaction is successfully sent.

```typescript
export type SendTransactionResult = {
  transactionData: any;
  receipt: {
    amount: number;
    date: Date | null;
    from: string;
    gasCostCryptoCurrency: string;
    network: string;
    nonce: number;
    to: string;
    transactionHash: string;
    transactionLink: string;
    transactionReceipt: any;
  };
};
```

- `transactionData`: Details of the transaction.
- `receipt`: Contains metadata about the transaction including the sender, recipient, gas costs, and a link to view the transaction on the network.

### `getFeeStatsResult`

This type is used to retrieve transaction fee statistics.

```typescript
export type getFeeStatsResult = {
  feeCryptoCurrency: string;
  baseFee: number;
  lowFeeCharged: number;
  standardFeeCharged: number;
  fastFeeCharged: number;
  maxFeeCharged: number;
};
```

- `feeCryptoCurrency`: The cryptocurrency used for transaction fees (e.g., `CHR`).
- `baseFee`: Base fee for a transaction.
- `lowFeeCharged`, `standardFeeCharged`, `fastFeeCharged`, `maxFeeCharged`: Different levels of transaction fees depending on speed and priority.

## Error Handling

Each function provides basic error handling for network requests. Ensure to handle any possible thrown errors in your implementation for a smoother user experience.
