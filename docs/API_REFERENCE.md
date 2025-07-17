# EVM API Reference

Complete reference for interacting with the Ethereum Virtual Machine deployment.

## 📋 Table of Contents

1. [RPC Endpoints](#rpc-endpoints)
2. [Standard Ethereum JSON-RPC Methods](#standard-ethereum-json-rpc-methods)
3. [Nethermind-Specific Methods](#nethermind-specific-methods)
4. [WebSocket Subscriptions](#websocket-subscriptions)
5. [Error Codes](#error-codes)
6. [Code Examples](#code-examples)

## 🔗 RPC Endpoints

### Local Development
- **HTTP**: `http://localhost:8545`
- **WebSocket**: `ws://localhost:8546`
- **Metrics**: `http://localhost:9091/metrics`

### GCP Production
- **HTTP**: `http://EXTERNAL_IP:8545`
- **WebSocket**: `ws://EXTERNAL_IP:8546`

## 📡 Standard Ethereum JSON-RPC Methods

### Network Information

#### `web3_clientVersion`
Returns the current client version.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' \
  http://localhost:8545
```

#### `net_version`
Returns the current network ID.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://localhost:8545
```

#### `net_peerCount`
Returns number of peers currently connected.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' \
  http://localhost:8545
```

### Blockchain Data

#### `eth_blockNumber`
Returns the number of most recent block.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

#### `eth_getBalance`
Returns the balance of the account at given address.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getBalance",
    "params":["0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "latest"],
    "id":1
  }' \
  http://localhost:8545
```

#### `eth_getBlockByNumber`
Returns information about a block by block number.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getBlockByNumber",
    "params":["latest", false],
    "id":1
  }' \
  http://localhost:8545
```

#### `eth_getTransactionByHash`
Returns information about a transaction by hash.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionByHash",
    "params":["TRANSACTION_HASH"],
    "id":1
  }' \
  http://localhost:8545
```

### Account Management

#### `eth_accounts`
Returns a list of addresses owned by client.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' \
  http://localhost:8545
```

#### `eth_getTransactionCount`
Returns the number of transactions sent from an address.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionCount",
    "params":["0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "latest"],
    "id":1
  }' \
  http://localhost:8545
```

### Transaction Management

#### `eth_sendTransaction`
Creates new message call transaction or a contract creation.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_sendTransaction",
    "params":[{
      "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "to": "0x8ba1f109551bD432803012645Ac136cc22C57B",
      "value": "0xde0b6b3a7640000",
      "gas": "0x5208"
    }],
    "id":1
  }' \
  http://localhost:8545
```

#### `eth_estimateGas`
Generates and returns an estimate of how much gas is necessary.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_estimateGas",
    "params":[{
      "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "to": "0x8ba1f109551bD432803012645Ac136cc22C57B",
      "value": "0xde0b6b3a7640000"
    }],
    "id":1
  }' \
  http://localhost:8545
```

#### `eth_gasPrice`
Returns the current price per gas in wei.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' \
  http://localhost:8545
```

### Smart Contracts

#### `eth_call`
Executes a new message call immediately without creating a transaction.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_call",
    "params":[{
      "to": "0xCONTRACT_ADDRESS",
      "data": "0x70a08231000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e"
    }, "latest"],
    "id":1
  }' \
  http://localhost:8545
```

#### `eth_getCode`
Returns code at a given address.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["0xCONTRACT_ADDRESS", "latest"],
    "id":1
  }' \
  http://localhost:8545
```

#### `eth_getLogs`
Returns an array of all logs matching filter.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getLogs",
    "params":[{
      "address": "0xCONTRACT_ADDRESS",
      "fromBlock": "0x0",
      "toBlock": "latest"
    }],
    "id":1
  }' \
  http://localhost:8545
```

### Sync Status

#### `eth_syncing`
Returns an object with sync status or false.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://localhost:8545
```

## 🔧 Nethermind-Specific Methods

### Debug Methods

#### `debug_traceTransaction`
Returns transaction trace.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"debug_traceTransaction",
    "params":["TRANSACTION_HASH"],
    "id":1
  }' \
  http://localhost:8545
```

### Trace Methods

#### `trace_replayTransaction`
Replays a transaction with detailed trace.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"trace_replayTransaction",
    "params":["TRANSACTION_HASH", ["trace"]],
    "id":1
  }' \
  http://localhost:8545
```

#### `trace_block`
Returns traces created at given block.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"trace_block",
    "params":["latest"],
    "id":1
  }' \
  http://localhost:8545
```

### Health Check

#### `health`
Returns node health status.

```bash
curl http://localhost:8545/health
```

## 🔌 WebSocket Subscriptions

Connect via WebSocket to receive real-time updates.

### New Block Headers
```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8546');

ws.on('open', () => {
  ws.send(JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_subscribe',
    params: ['newHeads'],
    id: 1
  }));
});

ws.on('message', (data) => {
  console.log(JSON.parse(data));
});
```

### Pending Transactions
```javascript
ws.send(JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  params: ['newPendingTransactions'],
  id: 2
}));
```

### Event Logs
```javascript
ws.send(JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  params: ['logs', {
    address: '0xCONTRACT_ADDRESS',
    topics: ['0xTOPIC_HASH']
  }],
  id: 3
}));
```

## ❌ Error Codes

### Standard JSON-RPC Errors
- `-32700`: Parse error
- `-32600`: Invalid Request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

### Ethereum-Specific Errors
- `-32000`: Invalid input
- `-32001`: Resource not found
- `-32002`: Resource unavailable
- `-32003`: Transaction rejected
- `-32004`: Method not supported
- `-32005`: Limit exceeded

## 💻 Code Examples

### JavaScript/Web3.js
```javascript
const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:8545');

// Get latest block
web3.eth.getBlock('latest').then(console.log);

// Send transaction
web3.eth.sendTransaction({
  from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  to: '0x8ba1f109551bD432803012645Ac136cc22C57B',
  value: web3.utils.toWei('1', 'ether')
});

// Call contract method
const contract = new web3.eth.Contract(ABI, contractAddress);
contract.methods.balanceOf(address).call();
```

### Python/Web3.py
```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

# Get latest block
block = w3.eth.get_block('latest')
print(block)

# Get balance
balance = w3.eth.get_balance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
print(f"Balance: {w3.fromWei(balance, 'ether')} ETH")

# Send transaction
tx = w3.eth.send_transaction({
    'from': '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    'to': '0x8ba1f109551bD432803012645Ac136cc22C57B',
    'value': w3.toWei(1, 'ether')
})
```

### Go/go-ethereum
```go
package main

import (
    "context"
    "fmt"
    "github.com/ethereum/go-ethereum/ethclient"
)

func main() {
    client, err := ethclient.Dial("http://localhost:8545")
    if err != nil {
        panic(err)
    }
    
    blockNumber, err := client.BlockNumber(context.Background())
    if err != nil {
        panic(err)
    }
    
    fmt.Printf("Latest block: %d\n", blockNumber)
}
```

### Rust/ethers-rs
```rust
use ethers::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider = Provider::<Http>::try_from("http://localhost:8545")?;
    
    let block_number = provider.get_block_number().await?;
    println!("Latest block: {}", block_number);
    
    Ok(())
}
```

## 📚 Additional Resources

- [Ethereum JSON-RPC Specification](https://ethereum.github.io/execution-apis/api-documentation/)
- [Nethermind Documentation](https://docs.nethermind.io/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Ethers.js Documentation](https://docs.ethers.io/)

---

**Need more help?** Check the [Tutorial](./TUTORIAL.md) for detailed examples and use cases.