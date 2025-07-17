# EVM Deployment Platform - User Guide
## Complete Guide for Developers and Operations Teams

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Installation & Setup](#installation--setup)
3. [Using the Platform](#using-the-platform)
4. [Development Examples](#development-examples)
5. [Monitoring & Operations](#monitoring--operations)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Configuration](#advanced-configuration)

---

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git for cloning the repository
- Node.js 14+ (for JavaScript examples)
- Python 3.8+ (for Python examples)

### 5-Minute Setup
```bash
# 1. Clone the repository
git clone https://github.com/myownipgit/EVM-Ethereum-Virtual-Machine-GCP-Singapore.git
cd EVM-Ethereum-Virtual-Machine-GCP-Singapore

# 2. Start the EVM platform
docker-compose up -d

# 3. Verify deployment
docker-compose ps

# 4. Test connection
cd examples
npm install
npm run demo
```

### Access Points
- **EVM JSON-RPC API**: http://localhost:8545
- **EVM WebSocket API**: ws://localhost:8546
- **Prometheus Metrics**: http://localhost:9090
- **Grafana Dashboard**: http://localhost:3001 (admin/admin)

---

## Installation & Setup

### System Requirements

**Minimum:**
- 8GB RAM
- 4 CPU cores
- 100GB free disk space
- Docker Desktop 4.0+

**Recommended:**
- 32GB RAM
- 8 CPU cores
- 500GB SSD storage
- Stable internet connection

### Local Development Setup

1. **Clone and Enter Directory**
   ```bash
   git clone https://github.com/myownipgit/EVM-Ethereum-Virtual-Machine-GCP-Singapore.git
   cd EVM-Ethereum-Virtual-Machine-GCP-Singapore
   ```

2. **Start All Services**
   ```bash
   docker-compose up -d
   ```

3. **Verify Services Are Running**
   ```bash
   docker-compose ps
   # All services should show "Up" status
   ```

4. **Check Logs (if needed)**
   ```bash
   docker-compose logs nethermind  # EVM node logs
   docker-compose logs grafana     # Dashboard logs
   docker-compose logs prometheus  # Metrics logs
   ```

### Production Cloud Setup

For production deployment on Google Cloud Platform:

```bash
# 1. Configure GCP credentials
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Run deployment script
chmod +x gcp-setup.sh
./gcp-setup.sh

# 3. Deploy to Kubernetes
kubectl apply -f k8s/
```

---

## Using the Platform

### Basic API Access

**Test Connection:**
```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}'
```

**Get Latest Block:**
```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Check Account Balance:**
```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","latest"],"id":1}'
```

### Available NPM Scripts

Navigate to the `examples/` directory and run:

```bash
cd examples
npm install  # First time only

# Available commands:
npm run demo     # Quick feature overview
npm run test     # Connection and endpoint testing
npm run basic    # Complete Web3.js examples
npm run mainnet  # Mainnet data exploration
npm run python   # Python examples (requires Python setup)
```

### Example Outputs

**Connection Test:**
```
⚡ Quick EVM Demo

🔗 Testing Connection...
   ✅ Connected to Chain ID 1 (Network 1)

👤 Creating Test Accounts...
   Account 1: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
   Account 2: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

⛽ Network Information...
   Gas Price: 1.0 Gwei
   Block Number: 156
   Connected Peers: 24
```

---

## Development Examples

### JavaScript Integration

**Basic Setup:**
```javascript
const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:8545');

// Check connection
const isConnected = await web3.eth.net.isListening();
console.log('Connected:', isConnected);

// Get latest block
const blockNumber = await web3.eth.getBlockNumber();
console.log('Latest block:', blockNumber);

// Get account balance
const balance = await web3.eth.getBalance('0xAddress...');
const ethBalance = web3.utils.fromWei(balance, 'ether');
console.log('Balance:', ethBalance, 'ETH');
```

**Smart Contract Deployment:**
```javascript
// Contract ABI and bytecode
const contractABI = [/* ABI array */];
const contractBytecode = "0x608060405...";

// Deploy contract
const contract = new web3.eth.Contract(contractABI);
const deployment = contract.deploy({ data: contractBytecode });

const deployedContract = await deployment.send({
  from: '0xYourAddress...',
  gas: 1500000,
  gasPrice: '20000000000'
});

console.log('Contract deployed at:', deployedContract.options.address);
```

### Python Integration

**Setup Virtual Environment:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install web3
```

**Basic Usage:**
```python
from web3 import Web3

# Connect to EVM
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
print('Connected:', w3.is_connected())

# Get latest block
block_number = w3.eth.block_number
print('Latest block:', block_number)

# Get account balance
balance = w3.eth.get_balance('0xAddress...')
eth_balance = w3.from_wei(balance, 'ether')
print('Balance:', eth_balance, 'ETH')
```

### Smart Contract Development

**Example Token Contract:**
```solidity
// contracts/src/EVMToken.sol
pragma solidity ^0.8.0;

contract EVMToken {
    mapping(address => uint256) private balances;
    string public name = "EVM Token";
    string public symbol = "EVM";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}
```

---

## Monitoring & Operations

### Grafana Dashboard Access

1. **Open Dashboard:**
   - URL: http://localhost:3001
   - Username: `admin`
   - Password: `admin` (change on first login)

2. **Key Metrics to Monitor:**
   - **Block Number**: Current blockchain height
   - **Peer Count**: Network connections (should be >10)
   - **Memory Usage**: Should remain stable
   - **Sync Status**: "false" when fully synced

### Understanding Dashboard Metrics

**Block Processing:**
```
ethereum_best_known_block_number: Current block being processed
ethereum_blockchain_height: Local blockchain height
ethereum_peer_count: Number of connected peers
```

**Performance Metrics:**
```
dotnet_total_memory_bytes: Memory usage (should be <4GB)
gc_collections_total: Garbage collection events
ethereum_transactions_pending: Pending transactions
```

**Network Health:**
```
ethereum_peer_limit: Maximum allowed peers
ethereum_sync_is_syncing: Whether node is syncing (1=yes, 0=no)
```

### Log Analysis

**View Real-time Logs:**
```bash
# EVM node logs
docker-compose logs -f nethermind

# All services logs
docker-compose logs -f

# Filter for errors
docker-compose logs nethermind | grep ERROR
```

**Common Log Messages:**
```
✅ "Nethermind started" - Node successfully initialized
✅ "Blockchain processor queue" - Block processing active  
✅ "Peers: XX" - Network connections established
⚠️ "Sync mode: StateNodes" - Initial sync in progress
❌ "Connection refused" - Network connectivity issues
```

### Health Checks

**Automated Health Check Script:**
```bash
#!/bin/bash
# health-check.sh

echo "🔍 EVM Health Check"

# Check if containers are running
echo "📦 Container Status:"
docker-compose ps

# Test API connectivity
echo "🌐 API Connectivity:"
curl -s -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' \
  && echo "✅ API responding" || echo "❌ API not responding"

# Check peer count
echo "👥 Network Peers:"
PEERS=$(curl -s -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' \
  | jq -r '.result')
echo "Connected peers: $PEERS"

# Check latest block
echo "📦 Latest Block:"
BLOCK=$(curl -s -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  | jq -r '.result')
echo "Block number: $((16#${BLOCK:2}))"
```

---

## Troubleshooting

### Common Issues & Solutions

**1. Container Won't Start**
```bash
# Problem: Port already in use
Error: bind: address already in use

# Solution: Stop conflicting services
sudo lsof -i :8545  # Find process using port
kill -9 <PID>       # Stop the process
docker-compose up -d
```

**2. No Network Peers**
```bash
# Problem: Firewall blocking P2P connections
# Solution: Open firewall ports
sudo ufw allow 30303/tcp
sudo ufw allow 30303/udp

# Or restart with network reset
docker-compose down
docker system prune -f
docker-compose up -d
```

**3. Sync Not Progressing**
```bash
# Check sync status
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'

# If stuck, restart with fresh data
docker-compose down -v  # WARNING: Deletes blockchain data
docker-compose up -d
```

**4. High Memory Usage**
```bash
# Check memory usage
docker stats nethermind-singapore

# If memory > 30GB, restart container
docker-compose restart nethermind
```

**5. API Connection Failures**
```bash
# Test different endpoints
curl http://localhost:8545     # Should return 405 Method Not Allowed
curl http://localhost:9090     # Prometheus (should load page)
curl http://localhost:3001     # Grafana (should redirect to login)

# Check container networking
docker network ls
docker network inspect evm_deploy_gcp_ethereum-net
```

### Debug Mode

**Enable Verbose Logging:**
```yaml
# Add to docker-compose.yml under nethermind environment:
environment:
  - NETHERMIND_LOGGERCONFIG_LOGGINGLEVEL=Debug
```

**Performance Troubleshooting:**
```bash
# Check disk space
df -h

# Check available memory
free -h

# Monitor container resources
docker stats

# Check for Docker Desktop limits
# Docker Desktop > Settings > Resources
```

### Recovery Procedures

**Complete Reset:**
```bash
# Stop all services
docker-compose down

# Remove all data (WARNING: Irreversible)
docker-compose down -v
docker system prune -a -f

# Fresh start
docker-compose up -d
```

**Partial Reset (Keep Grafana/Prometheus data):**
```bash
# Stop only EVM node
docker-compose stop nethermind

# Remove EVM data only
docker volume rm evm_deploy_gcp_nethermind-data
docker volume rm evm_deploy_gcp_nethermind-logs

# Restart
docker-compose up -d
```

---

## Advanced Configuration

### Custom Network Configuration

**Modify Nethermind Settings:**
```bash
# Edit config/nethermind.cfg
{
  "Init": {
    "ChainSpecPath": "chainspec/mainnet",
    "BaseDbPath": "nethermind_db/mainnet",
    "LogFileName": "mainnet.logs.txt"
  },
  "Network": {
    "MaxPeers": 50,
    "StaticPeers": ["enode://..."]
  },
  "JsonRpc": {
    "Enabled": true,
    "Host": "0.0.0.0",
    "Port": 8545
  }
}
```

### Custom Smart Contract Deployment

**Deploy Your Own Contracts:**
```javascript
// 1. Compile your Solidity contract
const fs = require('fs');
const solc = require('solc');

const source = fs.readFileSync('YourContract.sol', 'utf8');
const compiled = solc.compile(source);
const contract = compiled.contracts[':YourContract'];

// 2. Deploy using Web3
const web3 = new Web3('http://localhost:8545');
const deployedContract = await new web3.eth.Contract(contract.abi)
  .deploy({ data: contract.bytecode })
  .send({ from: account, gas: 1500000 });

console.log('Contract deployed at:', deployedContract.options.address);
```

### Production Hardening

**Security Configuration:**
```yaml
# docker-compose.yml modifications for production
services:
  nethermind:
    environment:
      - NETHERMIND_JSONRPCCONFIG_HOST=127.0.0.1  # Restrict to localhost
      - NETHERMIND_METRICSCONFIG_ENABLED=false   # Disable public metrics
    networks:
      - internal  # Use internal network only

  nginx:  # Add reverse proxy
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
```

**Backup Strategy:**
```bash
#!/bin/bash
# backup.sh - Regular backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/evm_$DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup blockchain data
docker run --rm -v evm_deploy_gcp_nethermind-data:/data -v $BACKUP_DIR:/backup alpine \
  tar czf /backup/nethermind-data.tar.gz -C /data .

# Backup Grafana dashboards
docker run --rm -v evm_deploy_gcp_grafana-data:/data -v $BACKUP_DIR:/backup alpine \
  tar czf /backup/grafana-data.tar.gz -C /data .

echo "Backup completed: $BACKUP_DIR"
```

### Integration Examples

**REST API Wrapper:**
```javascript
// api-server.js - Simple REST API for EVM
const express = require('express');
const { Web3 } = require('web3');

const app = express();
const web3 = new Web3('http://localhost:8545');

app.get('/api/balance/:address', async (req, res) => {
  try {
    const balance = await web3.eth.getBalance(req.params.address);
    res.json({ 
      address: req.params.address,
      balance: web3.utils.fromWei(balance, 'ether'),
      unit: 'ETH'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('EVM API server running on port 3000');
});
```

---

## Support & Resources

### Documentation
- **API Reference**: `/docs/API_REFERENCE.md`
- **Architecture Guide**: `/docs/ARCHITECTURE.md`
- **Tutorial**: `/docs/TUTORIAL.md`

### Community Resources
- **GitHub Repository**: https://github.com/myownipgit/EVM-Ethereum-Virtual-Machine-GCP-Singapore
- **Ethereum Documentation**: https://ethereum.org/developers
- **Nethermind Docs**: https://docs.nethermind.io

### Getting Help
1. Check this user guide first
2. Review logs: `docker-compose logs`
3. Check GitHub issues
4. Create new issue with:
   - Steps to reproduce
   - Error messages
   - System information
   - Log outputs

---

*This user guide covers the complete EVM deployment platform. For additional support or advanced use cases, refer to the documentation in the `/docs` directory or create an issue in the GitHub repository.*