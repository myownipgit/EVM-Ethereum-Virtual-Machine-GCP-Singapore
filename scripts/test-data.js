const { ethers } = require("ethers");

// Test wallet addresses with pre-funded ETH
const testWallets = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    balance: "100 ETH",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
  },
  {
    address: "0x8ba1f109551bD432803012645Ac136cc22C57B",
    balance: "50 ETH",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
  },
  {
    address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    balance: "25 ETH",
    privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    balance: "10 ETH",
    privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"
  },
  {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    balance: "5 ETH",
    privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"
  }
];

// Sample blockchain data
const sampleBlocks = [
  {
    number: "0x12D4B6",
    hash: "0x9b83c12c69edb74f6c8dd5d052765c1adf940e320bd1291696e6fa07829eee71",
    parentHash: "0x3d6122660cc824376f11ee842f83addc3525e2dd6756b9bcf0affa6aa88cf741",
    nonce: "0x0000000000000000",
    sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    transactionsRoot: "0xc43b4f90984b3e3a10c7b60a98bbafaee1e796b540e07e1e5a4e99e751331f5f",
    stateRoot: "0x2de31c57225fcf1e7a7ed6aaab0460287267bb4fe8db856e5d1a60bbdcdc09a4",
    receiptsRoot: "0x7cf43d7e837284f036cf92c56973f5e27bdd253ca46168fa195a6b07fa719f23",
    miner: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8",
    difficulty: "0x0",
    gasLimit: "0x1c9c380",
    gasUsed: "0x14820ef",
    timestamp: "0x64c4a1b7",
    baseFeePerGas: "0x32"
  }
];

// Sample transactions
const sampleTransactions = [
  {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0x8ba1f109551bD432803012645Ac136cc22C57B",
    value: ethers.utils.parseEther("1.5").toString(),
    gas: "21000",
    gasPrice: ethers.utils.parseUnits("20", "gwei").toString(),
    nonce: 0,
    data: "0x"
  },
  {
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0x8ba1f109551bD432803012645Ac136cc22C57B",
    to: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    value: ethers.utils.parseEther("0.5").toString(),
    gas: "21000",
    gasPrice: ethers.utils.parseUnits("25", "gwei").toString(),
    nonce: 1,
    data: "0x"
  }
];

// Contract deployment data
const contractDeployments = {
  EVMToken: {
    name: "EVM Token",
    symbol: "EVMT",
    decimals: 18,
    totalSupply: ethers.utils.parseEther("1000000").toString(),
    maxSupply: ethers.utils.parseEther("10000000").toString()
  },
  SimpleDEX: {
    name: "Simple DEX",
    exchangeRate: "1000",
    feePercentage: "30",
    feeDenominator: "10000"
  }
};

// Test scenarios
const testScenarios = [
  {
    name: "Token Transfer",
    description: "Transfer tokens between accounts",
    steps: [
      "Deploy EVMToken contract",
      "Transfer 1000 EVMT from owner to addr1",
      "Verify balance changes",
      "Check transfer event emission"
    ]
  },
  {
    name: "DEX Trading",
    description: "Buy and sell tokens on DEX",
    steps: [
      "Deploy EVMToken and SimpleDEX contracts",
      "Add liquidity to DEX",
      "Buy tokens with ETH",
      "Sell tokens back to ETH",
      "Verify price calculations"
    ]
  },
  {
    name: "Minting and Burning",
    description: "Test token supply management",
    steps: [
      "Add new minter address",
      "Mint tokens to different addresses",
      "Burn tokens from account",
      "Verify total supply changes"
    ]
  }
];

// Performance benchmarks
const performanceMetrics = {
  blocksPerSecond: 2,
  transactionsPerSecond: 15,
  avgBlockTime: 12,
  avgGasPrice: ethers.utils.parseUnits("20", "gwei").toString(),
  networkHashrate: "900 TH/s",
  totalTransactions: 2000000000,
  totalBlocks: 18500000
};

// Network configuration for different environments
const networkConfigs = {
  development: {
    chainId: 1337,
    rpcUrl: "http://localhost:8545",
    wsUrl: "ws://localhost:8546",
    explorerUrl: "http://localhost:4000"
  },
  staging: {
    chainId: 1337,
    rpcUrl: "http://staging-evm.example.com:8545",
    wsUrl: "ws://staging-evm.example.com:8546",
    explorerUrl: "http://staging-explorer.example.com"
  },
  production: {
    chainId: 1337,
    rpcUrl: "https://evm-singapore.example.com:8545",
    wsUrl: "wss://evm-singapore.example.com:8546",
    explorerUrl: "https://explorer.example.com"
  }
};

module.exports = {
  testWallets,
  sampleBlocks,
  sampleTransactions,
  contractDeployments,
  testScenarios,
  performanceMetrics,
  networkConfigs
};