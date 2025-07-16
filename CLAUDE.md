# EVM Deployment on GCP Singapore

## Project Overview
Enterprise-grade Ethereum Virtual Machine deployment using Nethermind on Google Cloud Platform Singapore region (asia-southeast1).

## Tech Stack
- **EVM Client**: Nethermind (fastest growing, 22-25% market share)
- **Cloud Provider**: Google Cloud Platform (Singapore)
- **Orchestration**: Kubernetes (GKE)
- **Monitoring**: Prometheus + Grafana
- **Storage**: 4TB SSD persistent disks
- **Instance Type**: e2-standard-8 (8 vCPUs, 32GB RAM)

## Quick Start

### 1. Deploy to GCP
```bash
# Full deployment (infrastructure + EVM)
./deploy.sh

# Check deployment status
./deploy.sh status

# View logs
./deploy.sh logs

# Clean up resources
./deploy.sh clean
```

### 2. Infrastructure Setup Only
```bash
# Set up GCP infrastructure
./gcp-setup.sh
```

### 3. Local Development
```bash
# Start local environment
docker-compose up -d

# View logs
docker-compose logs -f nethermind
```

## Key Features

### Network Configuration
- **Chain ID**: 1337 (custom fork)
- **Consensus**: Proof of Authority
- **Block Time**: 12 seconds
- **Gas Limit**: 30,000,000
- **Pre-funded Accounts**: 5 test wallets

### Performance Specifications
- **Sync Speed**: Fastest with Nethermind
- **TPS**: ~15 transactions per second
- **Storage**: 4TB SSD with auto-expansion
- **Memory**: 32GB RAM with 16GB guaranteed
- **CPU**: 8 vCPUs with 4 vCPU guarantee

### Security Features
- VPC network isolation
- Firewall rules for P2P and RPC
- Network policies for pod-to-pod communication
- Secrets management with GCP Secret Manager
- RBAC for Kubernetes resources

## Environment Variables

### Required for Deployment
```bash
export PROJECT_ID="evm-gcp"
export REGION="asia-southeast1"
export ZONE="asia-southeast1-a"
```

### Optional Configuration
```bash
export CLUSTER_NAME="ethereum-cluster"
export NAMESPACE="ethereum"
export INSTANCE_TYPE="e2-standard-8"
export DISK_SIZE="4TB"
```

## Test Wallets (Pre-funded)
```javascript
// Available in genesis.json
{
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e": "100 ETH",
  "0x8ba1f109551bD432803012645Ac136cc22C57B": "50 ETH", 
  "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097": "25 ETH",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906": "10 ETH",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": "5 ETH"
}
```

## Contract Deployment

### Deploy Sample Contracts
```bash
# Deploy EVM Token
forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY \
  contracts/src/EVMToken.sol:EVMToken

# Deploy Simple DEX
forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY \
  --constructor-args $TOKEN_ADDRESS \
  contracts/src/SimpleDEX.sol:SimpleDEX
```

### Run Tests
```bash
# Run contract tests
cd contracts && npm test

# Run integration tests
npm run test:integration
```

## Monitoring & Maintenance

### Access Monitoring
- **Prometheus**: http://PROMETHEUS_IP:9090
- **Grafana**: http://GRAFANA_IP:3000 (admin/admin)

### Health Checks
```bash
# Check EVM health
curl http://NETHERMIND_IP:8545/health

# Check block number
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://NETHERMIND_IP:8545
```

### Scaling
```bash
# Scale up nodes
kubectl scale deployment/nethermind-evm --replicas=3 -n ethereum

# Scale storage
kubectl patch pvc nethermind-data-pvc -n ethereum \
  -p '{"spec":{"resources":{"requests":{"storage":"8Ti"}}}}'
```

## Cost Estimates (Monthly)
- **Compute (e2-standard-8)**: $121.92
- **Storage (4TB SSD)**: $697.44
- **Load Balancer**: $21.90
- **Network Egress**: ~$75
- **Total**: ~$924/month

## Troubleshooting

### Common Issues
1. **Sync Issues**: Check network connectivity and peers
2. **Memory Issues**: Increase resource limits
3. **Storage Full**: Expand PVC or enable pruning
4. **Service Unreachable**: Check firewall rules and network policies

### Debug Commands
```bash
# Check pod status
kubectl get pods -n ethereum -o wide

# Describe failing pod
kubectl describe pod POD_NAME -n ethereum

# Get detailed logs
kubectl logs -f deployment/nethermind-evm -n ethereum --tail=100

# Check resource usage
kubectl top pods -n ethereum
```

## Security Guidelines

### Do Not:
- Expose RPC endpoints without authentication
- Store private keys in code or configs
- Use default passwords in production
- Deploy without proper network policies

### Best Practices:
- Use GCP Secret Manager for keys
- Enable VPC network policies
- Regular security audits
- Monitor unusual activity
- Keep software updated

## File Structure
```
EVM_deploy_GCP/
├── config/                 # Nethermind configuration
├── contracts/              # Smart contracts
├── k8s/                    # Kubernetes manifests
├── monitoring/             # Prometheus/Grafana config
├── scripts/                # Utility scripts
├── deploy.sh               # Main deployment script
├── gcp-setup.sh           # GCP infrastructure setup
├── docker-compose.yml     # Local development
└── Dockerfile             # Nethermind container
```

## Development Workflow
1. **Local Testing**: Use docker-compose for development
2. **Contract Development**: Use Foundry/Hardhat in contracts/
3. **Testing**: Run tests before deployment
4. **Staging**: Deploy to staging environment first
5. **Production**: Deploy with monitoring enabled

## Support
- **Documentation**: See technical plan in repository
- **Monitoring**: Check Grafana dashboards
- **Logs**: Use kubectl logs for debugging
- **Issues**: Report via GitHub issues