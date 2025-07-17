# EVM (Ethereum Virtual Machine) Tutorial

Welcome to the comprehensive tutorial for using the EVM deployment on GCP Singapore. This guide will walk you through everything from basic setup to advanced usage.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Local Development](#local-development)
3. [Connecting to the EVM](#connecting-to-the-evm)
4. [Basic Operations](#basic-operations)
5. [Working with Smart Contracts](#working-with-smart-contracts)
6. [Using Web3 Libraries](#using-web3-libraries)
7. [Monitoring and Debugging](#monitoring-and-debugging)
8. [Advanced Usage](#advanced-usage)
9. [Troubleshooting](#troubleshooting)

## 🚀 Getting Started

### Prerequisites
- Docker Desktop installed and running
- Node.js and npm (for Web3 interactions)
- Basic understanding of Ethereum and blockchain concepts

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/myownipgit/EVM-Ethereum-Virtual-Machine-GCP-Singapore.git
cd EVM-Ethereum-Virtual-Machine-GCP-Singapore

# Start local deployment
docker-compose up -d

# Verify services are running
docker-compose ps
```

## 🏠 Local Development

### Starting the EVM Locally
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f nethermind
```

### Service Endpoints
- **JSON-RPC**: http://localhost:8545
- **WebSocket**: ws://localhost:8546
- **Metrics**: http://localhost:9091/metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

## 🔌 Connecting to the EVM

### Using curl
```bash
# Test connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' \
  http://localhost:8545
```

### Using MetaMask
1. Open MetaMask
2. Click on network dropdown
3. Select "Add Network"
4. Enter:
   - Network Name: `Local EVM`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1` (mainnet fork)
   - Currency Symbol: `ETH`
5. Click "Save"

### Using Web3.js
```javascript
const { Web3 } = require('web3');

// Connect to local node
const web3 = new Web3('http://localhost:8545');

// Or use WebSocket
// const web3 = new Web3('ws://localhost:8546');

// Test connection
web3.eth.getBlockNumber()
  .then(console.log)
  .catch(console.error);
```

## 📋 Basic Operations

### 1. Check Network Status
```bash
# Get latest block number
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Get network ID
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://localhost:8545

# Check sync status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://localhost:8545
```

### 2. Account Management
```javascript
// Create new account
const account = web3.eth.accounts.create();
console.log('Address:', account.address);
console.log('Private Key:', account.privateKey);

// Check balance
web3.eth.getBalance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
  .then(balance => {
    console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
  });
```

### 3. Send Transactions
```javascript
// Send ETH
const tx = {
  from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  to: '0x8ba1f109551bD432803012645Ac136cc22C57B',
  value: web3.utils.toWei('1', 'ether'),
  gas: 21000
};

web3.eth.sendTransaction(tx)
  .then(receipt => {
    console.log('Transaction hash:', receipt.transactionHash);
  });
```

## 📝 Working with Smart Contracts

### Deploy a Contract
```javascript
// Simple storage contract
const contractCode = `
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private value;
    
    function set(uint256 _value) public {
        value = _value;
    }
    
    function get() public view returns (uint256) {
        return value;
    }
}`;

// Deploy using Web3.js
const contract = new web3.eth.Contract(ABI);
contract.deploy({
  data: bytecode,
  arguments: []
})
.send({
  from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  gas: 1500000
})
.then(newContract => {
  console.log('Contract deployed at:', newContract.options.address);
});
```

### Interact with Deployed Contracts

#### Using the Included EVMToken
```javascript
// EVMToken contract ABI (simplified)
const tokenABI = [
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [{"name": "account", "type": "address"}],
    "outputs": [{"name": "", "type": "uint256"}]
  },
  {
    "name": "transfer",
    "type": "function",
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool"}]
  }
];

// Connect to token contract
const tokenAddress = 'YOUR_TOKEN_ADDRESS';
const token = new web3.eth.Contract(tokenABI, tokenAddress);

// Check token balance
token.methods.balanceOf('0x742d35Cc6634C0532925a3b844Bc454e4438f44e').call()
  .then(balance => {
    console.log('Token balance:', balance);
  });

// Transfer tokens
token.methods.transfer('0x8ba1f109551bD432803012645Ac136cc22C57B', '1000000000000000000')
  .send({ from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  .then(receipt => {
    console.log('Transfer successful:', receipt.transactionHash);
  });
```

## 🛠️ Using Web3 Libraries

### ethers.js Example
```javascript
const { ethers } = require('ethers');

// Connect to local node
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

// Create wallet
const wallet = new ethers.Wallet('PRIVATE_KEY', provider);

// Send transaction
async function sendTransaction() {
  const tx = await wallet.sendTransaction({
    to: '0x8ba1f109551bD432803012645Ac136cc22C57B',
    value: ethers.utils.parseEther('0.1')
  });
  
  console.log('Transaction hash:', tx.hash);
  
  // Wait for confirmation
  const receipt = await tx.wait();
  console.log('Transaction confirmed in block:', receipt.blockNumber);
}
```

### Python Web3.py Example
```python
from web3 import Web3

# Connect to node
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

# Check connection
print(f"Connected: {w3.isConnected()}")
print(f"Block number: {w3.eth.block_number}")

# Get account balance
balance = w3.eth.get_balance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
print(f"Balance: {w3.fromWei(balance, 'ether')} ETH")
```

## 📊 Monitoring and Debugging

### 1. Access Grafana Dashboard
1. Open http://localhost:3001
2. Login with `admin`/`admin`
3. Navigate to "EVM Dashboard"
4. Monitor:
   - Block production
   - Transaction throughput
   - Resource usage
   - Network peers

### 2. Check Prometheus Metrics
```bash
# View all metrics
curl http://localhost:9091/metrics

# Specific metrics
curl http://localhost:9091/metrics | grep nethermind_blocks
```

### 3. Debug Transactions
```javascript
// Get transaction details
web3.eth.getTransaction('TRANSACTION_HASH')
  .then(console.log);

// Get transaction receipt
web3.eth.getTransactionReceipt('TRANSACTION_HASH')
  .then(console.log);

// Trace transaction
web3.debug.traceTransaction('TRANSACTION_HASH')
  .then(console.log);
```

### 4. View Logs
```bash
# Nethermind logs
docker-compose logs -f nethermind

# All services
docker-compose logs -f

# Specific time range
docker-compose logs --since "2023-01-01" --until "2023-12-31"
```

## 🔧 Advanced Usage

### 1. Batch Requests
```javascript
// Batch multiple calls
const batch = new web3.BatchRequest();

batch.add(web3.eth.getBalance.request('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', callback));
batch.add(web3.eth.getBlockNumber.request(callback));
batch.add(web3.eth.getGasPrice.request(callback));

batch.execute();
```

### 2. Event Subscriptions
```javascript
// Subscribe to new blocks
web3.eth.subscribe('newBlockHeaders')
  .on('data', (blockHeader) => {
    console.log('New block:', blockHeader.number);
  })
  .on('error', console.error);

// Subscribe to pending transactions
web3.eth.subscribe('pendingTransactions')
  .on('data', (txHash) => {
    console.log('Pending transaction:', txHash);
  });
```

### 3. Custom RPC Methods
```javascript
// Call custom Nethermind methods
web3.currentProvider.send({
  jsonrpc: '2.0',
  method: 'trace_replayTransaction',
  params: ['TRANSACTION_HASH', ['trace']],
  id: 1
}, (error, result) => {
  console.log(result);
});
```

## ❗ Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check if services are running
docker-compose ps

# Restart services
docker-compose restart

# Check logs for errors
docker-compose logs nethermind
```

#### 2. Slow Sync
```bash
# Check sync status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://localhost:8545

# Check peer count
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' \
  http://localhost:8545
```

#### 3. Out of Gas Errors
```javascript
// Estimate gas before sending
const gasEstimate = await contract.methods.myMethod().estimateGas();

// Add 20% buffer
const gasLimit = Math.floor(gasEstimate * 1.2);
```

#### 4. Reset Local Blockchain
```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 📚 Additional Resources

### Useful Commands Reference
```bash
# Service management
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose restart      # Restart services
docker-compose logs -f      # View logs

# Monitoring
curl http://localhost:8545  # Test RPC
curl http://localhost:9091/metrics  # View metrics
```

### Pre-funded Test Accounts
```
Address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
Balance: 100 ETH

Address: 0x8ba1f109551bD432803012645Ac136cc22C57B
Balance: 50 ETH

Address: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
Balance: 25 ETH

Address: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
Balance: 10 ETH

Address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
Balance: 5 ETH
```

### Next Steps
1. Deploy your own smart contracts
2. Build a DApp frontend
3. Set up automated testing
4. Deploy to GCP for production use

---

**Need Help?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) or create an issue in the GitHub repository.