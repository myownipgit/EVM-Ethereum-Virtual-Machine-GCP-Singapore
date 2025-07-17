# EVM (Ethereum Virtual Machine) Deployment on GCP Singapore

🚀 **Enterprise-grade Ethereum Virtual Machine deployment using Nethermind on Google Cloud Platform Singapore region**

## Overview

This project provides a complete, production-ready deployment of an Ethereum Virtual Machine (EVM) on Google Cloud Platform's Singapore region using Nethermind client. The deployment includes infrastructure automation, monitoring, and sample smart contracts.

### Why Nethermind?
- **Performance**: Fastest sync speed and transaction throughput
- **Market Share**: 22-25% and rapidly growing
- **Container Support**: Superior Docker support with security features
- **Resource Efficiency**: Online pruning and efficient memory usage

## Quick Start

### Prerequisites
- Google Cloud SDK (`gcloud`)
- Kubernetes CLI (`kubectl`)
- Docker
- GCP account with billing enabled

### 1. Clone and Deploy
```bash
git clone https://github.com/myownipgit/EVM-Ethereum-Virtual-Machine-GCP-Singapore.git
cd EVM-Ethereum-Virtual-Machine-GCP-Singapore
./deploy.sh
```

### 2. Access Services
After deployment, you'll receive endpoints for:
- **Nethermind RPC**: `http://EXTERNAL_IP:8545`
- **WebSocket**: `ws://EXTERNAL_IP:8546`
- **Prometheus**: `http://PROMETHEUS_IP:9090`
- **Grafana**: `http://GRAFANA_IP:3000` (admin/admin)

### 3. Test the Deployment
```bash
# Check block number
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://EXTERNAL_IP:8545

# Check network status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://EXTERNAL_IP:8545
```

## Architecture

### Infrastructure
- **Region**: Asia Southeast 1 (Singapore)
- **Compute**: GKE cluster with e2-standard-8 instances
- **Storage**: 4TB SSD persistent disks
- **Network**: Custom VPC with firewall rules
- **Monitoring**: Prometheus + Grafana stack

### Network Configuration
- **Chain ID**: 1337 (custom fork)
- **Consensus**: Proof of Authority
- **Block Time**: ~12 seconds
- **Gas Limit**: 30,000,000
- **Pre-funded Accounts**: 5 test wallets with ETH

## Cost Breakdown

**Monthly Estimates (Singapore Region)**:
- Compute Engine (e2-standard-8): **$121.92**
- SSD Storage (4TB): **$697.44**
- Load Balancer: **$21.90**
- Network Egress: **~$75**
- **Total: ~$924/month**

## File Structure

```
EVM-Ethereum-Virtual-Machine-GCP-Singapore/
├── config/
│   ├── nethermind.cfg          # Nethermind configuration
│   └── genesis.json            # Genesis block definition
├── contracts/
│   ├── src/                    # Smart contracts
│   └── test/                   # Contract tests
├── k8s/
│   ├── configmap.yaml          # Kubernetes configs
│   ├── deployment.yaml         # Main deployment
│   ├── service.yaml            # Services & networking
│   ├── storage.yaml            # Persistent volumes
│   └── monitoring.yaml         # Prometheus & Grafana
├── monitoring/
│   └── prometheus.yml          # Prometheus config
├── scripts/
│   └── test-data.js           # Test data and scenarios
├── deploy.sh                   # Main deployment script
├── gcp-setup.sh               # GCP infrastructure setup
├── docker-compose.yml         # Local development
└── Dockerfile                 # Nethermind container
```

## Smart Contracts

### Included Contracts
1. **EVMToken**: ERC-20 token with minting/burning
2. **SimpleDEX**: Basic decentralized exchange

### Pre-funded Test Wallets
```javascript
{
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e": "100 ETH",
  "0x8ba1f109551bD432803012645Ac136cc22C57B": "50 ETH",
  "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097": "25 ETH",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906": "10 ETH",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": "5 ETH"
}
```

## Management Commands

### Deployment
```bash
# Full deployment
./deploy.sh

# Check status
./deploy.sh status

# View logs
./deploy.sh logs

# Clean up
./deploy.sh clean
```

### Kubernetes Operations
```bash
# Check pods
kubectl get pods -n ethereum

# Scale deployment
kubectl scale deployment/nethermind-evm --replicas=2 -n ethereum

# Update config
kubectl apply -f k8s/configmap.yaml

# Port forward for local access
kubectl port-forward svc/nethermind-service 8545:8545 -n ethereum
```

## Security Features

- **Network Isolation**: Custom VPC with controlled access
- **Firewall Rules**: Restricted RPC access from internal networks
- **RBAC**: Kubernetes role-based access control
- **Secrets Management**: GCP Secret Manager integration
- **Network Policies**: Pod-to-pod communication control

## Monitoring

### Prometheus Metrics
- Block production rate
- Transaction throughput
- Memory and CPU usage
- Network peer count
- Sync status

### Grafana Dashboards
- EVM Performance Overview
- Resource Utilization
- Network Health
- Transaction Analytics

## Development

### Local Development
```bash
# Start local environment
docker-compose up -d

# Run tests
cd contracts && npm test

# Deploy contracts locally
forge create --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY \
  contracts/src/EVMToken.sol:EVMToken
```

### Testing
```bash
# Run smart contract tests
cd contracts && npm test

# Test RPC endpoints
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

## Troubleshooting

### Common Issues
1. **Sync Issues**: Check network connectivity and peer connections
2. **Memory Problems**: Increase resource limits in deployment.yaml
3. **Storage Full**: Expand PVC or enable pruning
4. **Service Unreachable**: Verify firewall rules and network policies

### Debug Commands
```bash
# Check pod details
kubectl describe pod POD_NAME -n ethereum

# View resource usage
kubectl top pods -n ethereum

# Check events
kubectl get events -n ethereum --sort-by=.metadata.creationTimestamp

# Access pod shell
kubectl exec -it POD_NAME -n ethereum -- /bin/bash
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Documentation

### Getting Started
- **[Quick Start Guide](docs/QUICK_START.md)** - Get running in under 5 minutes
- **[Complete Tutorial](docs/TUTORIAL.md)** - Comprehensive usage guide
- **[API Reference](docs/API_REFERENCE.md)** - Complete RPC API documentation

### Examples
- **[JavaScript Examples](examples/basic_usage.js)** - Web3.js examples
- **[Python Examples](examples/python_example.py)** - Python Web3.py examples
- **[Connection Test](examples/test_connection.js)** - Quick connectivity test

### Advanced
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and components
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Contributing](CONTRIBUTING.md)** - Development guidelines

## Support

For issues, questions, or contributions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the monitoring dashboards
- Consult the technical documentation

---

**⚠️ Important**: This deployment creates billable GCP resources. Remember to clean up resources when not needed using `./deploy.sh clean`.