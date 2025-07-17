# Quick Start Guide - EVM Application

This guide will get you up and running with the EVM application in under 5 minutes.

## 🏃 Quick Setup

### 1. Start the EVM
```bash
# Clone the repository
git clone https://github.com/myownipgit/EVM-Ethereum-Virtual-Machine-GCP-Singapore.git
cd EVM-Ethereum-Virtual-Machine-GCP-Singapore

# Start services
docker-compose up -d
```

### 2. Verify It's Running
```bash
# Check services
docker-compose ps

# Test the connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

## 🎯 Quick Tasks

### Send Your First Transaction
```bash
# Using curl (replace with actual addresses and private keys)
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_sendTransaction",
    "params":[{
      "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "to": "0x8ba1f109551bD432803012645Ac136cc22C57B",
      "value": "0xde0b6b3a7640000"
    }],
    "id":1
  }' \
  http://localhost:8545
```

### Deploy a Simple Contract
```javascript
// save as deploy.js
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const bytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220';

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  
  const contract = new web3.eth.Contract([]);
  const deployment = contract.deploy({ data: bytecode });
  
  const newContract = await deployment.send({
    from: accounts[0],
    gas: 1500000
  });
  
  console.log('Contract deployed at:', newContract.options.address);
}

deploy();
```

### Connect MetaMask
1. Open MetaMask
2. Add Custom RPC:
   - Network: `Local EVM`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1`
   - Symbol: `ETH`

## 📊 Monitor Your Node

### Grafana Dashboard
- URL: http://localhost:3001
- Login: `admin` / `admin`
- View real-time metrics

### Check Sync Status
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://localhost:8545
```

## 🛑 Stop the EVM
```bash
docker-compose down
```

## 🆘 Need Help?
- Full Tutorial: [TUTORIAL.md](./TUTORIAL.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)