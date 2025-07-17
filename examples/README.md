# EVM Examples

Ready-to-run examples for interacting with the EVM deployment.

## 🚀 Quick Start

```bash
cd examples
npm install
npm run demo
```

## 📋 Available Examples

### `npm run demo`
**Quick Demo** - Shows all features and capabilities
- Tests connection and RPC methods
- Creates sample accounts
- Demonstrates smart contract preparation
- Shows sync status and available features

### `npm run test`
**Connection Test** - Comprehensive connectivity testing
- Tests HTTP and WebSocket connections
- Checks network information
- Validates all endpoints
- Provides troubleshooting tips

### `npm run mainnet`
**Mainnet Explorer** - Explore Ethereum mainnet data
- Checks famous addresses
- Examines smart contracts
- Monitors new blocks
- *Note: Requires mainnet sync to complete*

### `npm run basic`
**Basic Usage** - Complete Web3.js examples
- Account management
- Transaction sending
- Smart contract deployment
- Event subscriptions

### `npm run python`
**Python Examples** - Python Web3.py demonstrations
- Same features as JavaScript examples
- Uses Python syntax
- *Requires: `pip install web3`*

## 🔧 Individual Scripts

| Script | Purpose |
|--------|---------|
| `quick_demo.js` | Feature overview and status |
| `test_connection.js` | Connectivity testing |
| `mainnet_example.js` | Mainnet data exploration |
| `basic_usage.js` | Complete Web3.js examples |
| `python_example.py` | Python Web3.py examples |

## 🎯 What Each Example Shows

### Connection Testing
- Network connectivity
- RPC endpoint validation
- WebSocket functionality
- Peer connections
- Sync status

### Account Management
- Creating accounts
- Checking balances
- Transaction sending
- Nonce management

### Smart Contracts
- Contract compilation
- Deployment process
- Method calling
- Event monitoring

### Network Monitoring
- Block monitoring
- Transaction tracking
- Gas price monitoring
- Peer count checking

## 📊 Expected Behavior

### Fresh Deployment (Block 0)
- All examples work immediately
- Accounts show 0 ETH (normal)
- Node is operational but not synced
- Perfect for testing functionality

### After Mainnet Sync
- Real mainnet data available
- Famous addresses show actual balances
- Smart contracts accessible
- Full historical data

## 🆘 Troubleshooting

### "Connection Failed"
```bash
# Check if EVM is running
docker-compose ps

# Restart if needed
docker-compose restart

# Check logs
docker-compose logs nethermind
```

### "Web3 is not a constructor"
```bash
# Update to latest package
npm install web3@latest

# Check Node.js version
node --version  # Should be 14+
```

### "Insufficient Funds"
This is normal for a fresh mainnet fork. The examples handle this gracefully and still demonstrate functionality.

## 🔗 Related Documentation

- [Complete Tutorial](../docs/TUTORIAL.md)
- [API Reference](../docs/API_REFERENCE.md)
- [Quick Start Guide](../docs/QUICK_START.md)

---

**💡 Tip**: Start with `npm run demo` to see everything working, then explore specific examples!