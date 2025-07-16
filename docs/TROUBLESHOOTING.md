# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the EVM GCP Singapore deployment.

## 🚨 Common Issues and Solutions

### 1. Deployment Issues

#### **Issue**: "gcloud command not found"
```bash
# Solution: Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

#### **Issue**: "kubectl command not found"
```bash
# Solution: Install kubectl
gcloud components install kubectl
# Or use the PATH
export PATH="/opt/homebrew/share/google-cloud-sdk/bin:$PATH"
```

#### **Issue**: "Insufficient permissions"
```bash
# Solution: Authenticate with proper permissions
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Kubernetes Issues

#### **Issue**: "Pods stuck in Pending state"
```bash
# Diagnosis
kubectl describe pod POD_NAME -n ethereum
kubectl get events -n ethereum --sort-by=.metadata.creationTimestamp

# Common causes and solutions:
# 1. Insufficient resources
kubectl top nodes
kubectl describe nodes

# 2. PVC not binding
kubectl get pvc -n ethereum
kubectl describe pvc PVC_NAME -n ethereum

# 3. Storage quota exceeded
gcloud compute project-info describe --format="table(quotas.metric,quotas.limit,quotas.usage)"
```

#### **Issue**: "PersistentVolumeClaim stuck in Pending"
```bash
# Check storage class
kubectl get storageclass

# Check quota
gcloud compute regions describe asia-southeast1 --format="table(quotas.metric,quotas.limit,quotas.usage)"

# Solution: Reduce storage size or request quota increase
kubectl patch pvc PVC_NAME -p '{"spec":{"resources":{"requests":{"storage":"SMALLER_SIZE"}}}}'
```

### 3. Nethermind Issues

#### **Issue**: "Nethermind pod crashing"
```bash
# Check logs
kubectl logs -f deployment/nethermind-evm -n ethereum

# Common solutions:
# 1. Configuration issues
kubectl edit configmap nethermind-config -n ethereum

# 2. Resource limits
kubectl describe pod POD_NAME -n ethereum
```

#### **Issue**: "Chain specification not found"
```bash
# Solution: Use built-in chainspec
kubectl edit configmap nethermind-config -n ethereum
# Change ChainSpecPath to "chainspec/mainnet"
```

#### **Issue**: "Sync not progressing"
```bash
# Check sync status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://EXTERNAL_IP:8545

# Check peers
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' \
  http://EXTERNAL_IP:8545
```

### 4. Networking Issues

#### **Issue**: "LoadBalancer service has no external IP"
```bash
# Check service status
kubectl get svc -n ethereum
kubectl describe svc SERVICE_NAME -n ethereum

# Wait for external IP assignment (can take 2-5 minutes)
kubectl get svc -n ethereum -w
```

#### **Issue**: "Connection refused to RPC endpoint"
```bash
# Check if pod is running
kubectl get pods -n ethereum

# Check if service is correct
kubectl get svc nethermind-service -n ethereum

# Port forward for testing
kubectl port-forward svc/nethermind-service 8545:8545 -n ethereum
```

#### **Issue**: "Mixed protocol LoadBalancer error"
```bash
# Solution: Separate TCP and UDP services
# This is already implemented in the current configuration
kubectl get svc -n ethereum
```

### 5. Storage Issues

#### **Issue**: "Disk space full"
```bash
# Check disk usage
kubectl exec -it POD_NAME -n ethereum -- df -h

# Solution: Expand PVC
kubectl patch pvc PVC_NAME -n ethereum \
  -p '{"spec":{"resources":{"requests":{"storage":"LARGER_SIZE"}}}}'
```

#### **Issue**: "Regional storage class not supported"
```bash
# Solution: Use single-zone storage
kubectl get storageclass
# Update storage.yaml to use pd-ssd instead of regional-pd
```

### 6. Monitoring Issues

#### **Issue**: "Prometheus not scraping metrics"
```bash
# Check Prometheus configuration
kubectl get configmap prometheus-config -n ethereum -o yaml

# Check if metrics endpoint is accessible
kubectl exec -it POD_NAME -n ethereum -- curl localhost:9091/metrics
```

#### **Issue**: "Grafana not accessible"
```bash
# Check Grafana pod
kubectl get pods -n ethereum -l app=grafana

# Check Grafana service
kubectl get svc grafana-service -n ethereum

# Access Grafana locally
kubectl port-forward svc/grafana-service 3000:3000 -n ethereum
```

## 🔍 Diagnostic Commands

### General Health Check
```bash
# Check all resources
kubectl get all -n ethereum

# Check events
kubectl get events -n ethereum --sort-by=.metadata.creationTimestamp

# Check resource usage
kubectl top pods -n ethereum
kubectl top nodes
```

### Network Diagnostics
```bash
# Test RPC endpoint
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://EXTERNAL_IP:8545

# Test WebSocket
wscat -c ws://EXTERNAL_IP:8546

# Check firewall rules
gcloud compute firewall-rules list --filter="name~ethereum"
```

### Storage Diagnostics
```bash
# Check PVC status
kubectl get pvc -n ethereum

# Check storage class
kubectl describe storageclass ssd-regional

# Check available storage
kubectl exec -it POD_NAME -n ethereum -- df -h /nethermind/data
```

## 📊 Performance Troubleshooting

### High CPU Usage
```bash
# Check resource limits
kubectl describe pod POD_NAME -n ethereum

# Scale up resources
kubectl patch deployment nethermind-evm -n ethereum \
  -p '{"spec":{"template":{"spec":{"containers":[{"name":"nethermind","resources":{"limits":{"cpu":"16","memory":"64Gi"}}}]}}}}'
```

### High Memory Usage
```bash
# Check memory usage
kubectl top pod POD_NAME -n ethereum

# Check for memory leaks
kubectl exec -it POD_NAME -n ethereum -- ps aux
```

### Slow Sync Performance
```bash
# Check sync status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://EXTERNAL_IP:8545

# Optimize configuration
kubectl edit configmap nethermind-config -n ethereum
```

## 🛠️ Recovery Procedures

### Complete Deployment Reset
```bash
# Delete all resources
kubectl delete namespace ethereum

# Recreate deployment
./deploy.sh
```

### Partial Reset (Keep Data)
```bash
# Scale down deployment
kubectl scale deployment nethermind-evm --replicas=0 -n ethereum

# Update configuration
kubectl apply -f k8s/configmap.yaml

# Scale back up
kubectl scale deployment nethermind-evm --replicas=1 -n ethereum
```

### Emergency Stop
```bash
# Stop all services immediately
kubectl delete namespace ethereum

# Clean up GCP resources
gcloud container clusters delete ethereum-cluster --zone=asia-southeast1-a
gcloud compute firewall-rules delete ethereum-p2p ethereum-rpc
gcloud compute networks subnets delete ethereum-subnet --region=asia-southeast1
gcloud compute networks delete ethereum-vpc
```

## 📝 Logging and Monitoring

### Enable Debug Logging
```bash
# Update Nethermind config for debug logging
kubectl edit configmap nethermind-config -n ethereum
# Add "LogLevel": "Debug" to the configuration
```

### Export Logs
```bash
# Export pod logs
kubectl logs deployment/nethermind-evm -n ethereum > nethermind.log

# Export events
kubectl get events -n ethereum --sort-by=.metadata.creationTimestamp > events.log
```

### Monitoring Checklist
- [ ] All pods are running
- [ ] External IPs are assigned
- [ ] RPC endpoint is responding
- [ ] Sync is progressing
- [ ] No resource limits exceeded
- [ ] No storage issues
- [ ] Monitoring is collecting metrics

## 🆘 Getting Help

### Before Seeking Help
1. Check this troubleshooting guide
2. Review the logs: `kubectl logs -f deployment/nethermind-evm -n ethereum`
3. Check resource status: `kubectl get all -n ethereum`
4. Test basic connectivity: `curl http://EXTERNAL_IP:8545`

### Information to Include
- Error messages and logs
- Output of `kubectl get all -n ethereum`
- GCP project and region details
- Steps taken before the issue occurred
- Expected vs actual behavior

### Support Channels
- GitHub Issues: For project-related problems
- GCP Documentation: For Google Cloud issues
- Kubernetes Documentation: For K8s-related issues
- Nethermind Documentation: For client-specific issues

## 🔄 Maintenance Procedures

### Regular Health Checks
```bash
# Weekly health check script
#!/bin/bash
echo "=== EVM Health Check ==="
kubectl get pods -n ethereum
kubectl get svc -n ethereum
kubectl top pods -n ethereum
echo "=== RPC Test ==="
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://$(kubectl get svc nethermind-service -n ethereum -o jsonpath='{.status.loadBalancer.ingress[0].ip}'):8545
```

### Update Procedures
```bash
# Update Nethermind version
kubectl set image deployment/nethermind-evm nethermind=nethermind/nethermind:NEW_VERSION -n ethereum

# Update configuration
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment/nethermind-evm -n ethereum
```

This troubleshooting guide should help you resolve most common issues with the EVM deployment.