# EVM (Ethereum Virtual Machine) GCP Singapore Deployment Architecture

## 🏗️ System Architecture Overview

This document provides a comprehensive overview of the EVM deployment architecture on Google Cloud Platform Singapore region.

## 🌐 High-Level Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           Internet                      │
                    └─────────────────┬───────────────────────┘
                                     │
                    ┌─────────────────▼───────────────────────┐
                    │      Google Cloud Load Balancer        │
                    │                                         │
                    │  ┌─────────────┐  ┌─────────────────┐   │
                    │  │   RPC/WS    │  │   Monitoring    │   │
                    │  │  :8545/8546 │  │  :9090/:3000    │   │
                    │  └─────────────┘  └─────────────────┘   │
                    └─────────────────┬───────────────────────┘
                                     │
                    ┌─────────────────▼───────────────────────┐
                    │           GKE Cluster                   │
                    │        (asia-southeast1-a)             │
                    │                                         │
                    │  ┌─────────────┐  ┌─────────────────┐   │
                    │  │ Nethermind  │  │   Monitoring    │   │
                    │  │    Pods     │  │     Stack       │   │
                    │  └─────────────┘  └─────────────────┘   │
                    └─────────────────┬───────────────────────┘
                                     │
                    ┌─────────────────▼───────────────────────┐
                    │        Persistent Storage               │
                    │                                         │
                    │  ┌─────────────┐  ┌─────────────────┐   │
                    │  │ Blockchain  │  │   Monitoring    │   │
                    │  │    Data     │  │     Data        │   │
                    │  └─────────────┘  └─────────────────┘   │
                    └─────────────────────────────────────────┘
```

## 📊 Component Architecture

### 1. Google Cloud Platform Layer

#### **Region & Zone**
- **Region**: asia-southeast1 (Singapore)
- **Zone**: asia-southeast1-a
- **Rationale**: Low latency for Asia-Pacific users

#### **Networking**
```
ethereum-vpc (10.0.0.0/24)
├── ethereum-subnet (10.0.0.0/24)
├── Firewall Rules
│   ├── ethereum-p2p (30303/tcp,udp)
│   └── ethereum-rpc (8545/tcp, 8546/tcp)
└── Load Balancers
    ├── nethermind-service (RPC/WebSocket)
    ├── nethermind-p2p (P2P networking)
    ├── prometheus-service (Metrics)
    └── grafana-service (Dashboard)
```

### 2. Kubernetes (GKE) Layer

#### **Cluster Configuration**
```yaml
Cluster: ethereum-cluster
├── Node Pool: default-pool
│   ├── Machine Type: e2-standard-8
│   ├── Nodes: 2-3 (auto-scaling)
│   ├── Disk: 100GB SSD per node
│   └── Network: ethereum-vpc
├── Networking: VPC-native
├── Monitoring: Enabled
└── Logging: Enabled
```

#### **Namespaces**
- **ethereum**: Main application namespace
- **kube-system**: Kubernetes system components
- **gke-system**: GKE-specific components

### 3. Application Layer

#### **Nethermind EVM**
```yaml
Deployment: nethermind-evm
├── Replicas: 1 (configurable)
├── Container: nethermind/nethermind:latest
├── Resources:
│   ├── CPU: 4-8 cores
│   ├── Memory: 16-32GB
│   └── Storage: 30GB (expandable)
├── Ports:
│   ├── 8545: JSON-RPC
│   ├── 8546: WebSocket
│   ├── 30303: P2P
│   └── 9091: Metrics
└── Configuration: mainnet sync
```

#### **Monitoring Stack**
```yaml
Prometheus:
├── Data Collection: Nethermind metrics
├── Storage: 20GB SSD
├── Retention: 7 days
└── Scrape Interval: 15s

Grafana:
├── Dashboard: EVM metrics
├── Data Source: Prometheus
├── Storage: 50GB SSD
└── Authentication: admin/admin
```

### 4. Storage Layer

#### **Persistent Volume Claims**
```yaml
Storage Class: ssd-regional
├── Provisioner: pd.csi.storage.gke.io
├── Type: pd-ssd
├── Binding: WaitForFirstConsumer
└── Expansion: Enabled

Volumes:
├── nethermind-data-pvc: 30GB (blockchain data)
├── nethermind-logs-pvc: 100GB (logs)
├── prometheus-data-pvc: 20GB (metrics)
└── grafana-data-pvc: 50GB (dashboards)
```

## 🔐 Security Architecture

### Network Security
```
Internet
    ↓
Google Cloud Load Balancer
    ↓
VPC Firewall Rules
    ↓
Kubernetes Network Policies
    ↓
Pod-to-Pod Communication
```

### Security Layers
1. **GCP IAM**: Project-level access control
2. **VPC Firewall**: Network-level filtering
3. **Kubernetes RBAC**: Service account permissions
4. **Network Policies**: Pod-to-pod communication rules
5. **Container Security**: Rootless containers

## 📈 Scalability Design

### Horizontal Scaling
```yaml
Auto-scaling:
├── Cluster Autoscaler: 1-3 nodes
├── HPA: Based on CPU/Memory
├── VPA: Vertical resource adjustment
└── Manual Scaling: kubectl scale
```

### Vertical Scaling
```yaml
Resource Limits:
├── CPU: 4-8 cores per pod
├── Memory: 16-32GB per pod
├── Storage: Auto-expansion enabled
└── Network: Load balancer distribution
```

## 🔄 Data Flow Architecture

### 1. Blockchain Synchronization
```
Ethereum Network
    ↓
P2P Protocol (30303)
    ↓
Nethermind Client
    ↓
Persistent Storage
```

### 2. RPC Request Flow
```
Client Application
    ↓
Load Balancer (8545/8546)
    ↓
Kubernetes Service
    ↓
Nethermind Pod
    ↓
Response
```

### 3. Monitoring Data Flow
```
Nethermind Metrics (9091)
    ↓
Prometheus Scraping
    ↓
Prometheus Storage
    ↓
Grafana Visualization
```

## 🛡️ High Availability Design

### Redundancy
- **Multi-zone deployment**: Future enhancement
- **Load balancer redundancy**: GCP-managed
- **Storage replication**: SSD with snapshots
- **Pod restart policies**: Always restart

### Disaster Recovery
```yaml
Backup Strategy:
├── Automated Snapshots: Daily
├── Cross-region Backup: Planned
├── Configuration Backup: Git repository
└── Recovery Time: < 30 minutes
```

## 📊 Performance Characteristics

### Network Performance
- **Latency**: < 50ms (Asia-Pacific)
- **Throughput**: 10Gbps network
- **Concurrent Connections**: 1000+

### Storage Performance
- **IOPS**: 3,000-15,000 (SSD)
- **Throughput**: 480MB/s
- **Latency**: < 1ms

### Compute Performance
- **CPU**: 8 vCPUs per node
- **Memory**: 32GB per node
- **Network**: 16Gbps

## 🔧 Configuration Management

### Infrastructure as Code
```
Repository Structure:
├── gcp-setup.sh: Infrastructure provisioning
├── k8s/: Kubernetes manifests
├── config/: Application configuration
├── monitoring/: Observability setup
└── deploy.sh: Orchestration script
```

### Configuration Sources
1. **Environment Variables**: Runtime configuration
2. **ConfigMaps**: Application settings
3. **Secrets**: Sensitive data (future)
4. **Helm Charts**: Package management (future)

## 🌍 Regional Considerations

### Singapore Region Benefits
- **Low latency**: For Asia-Pacific users
- **Data residency**: Singapore data laws
- **Availability**: 99.9% SLA
- **Compliance**: Various certifications

### Network Optimization
- **CDN**: Not applicable for blockchain
- **Edge locations**: P2P networking
- **Bandwidth**: Optimized for sync
- **Peering**: Direct connections

## 📋 Monitoring Architecture

### Metrics Collection
```yaml
Prometheus Configuration:
├── Scrape Targets:
│   ├── Nethermind: Node metrics
│   ├── Kubernetes: Cluster metrics
│   └── System: Host metrics
├── Alerting Rules: Custom alerts
├── Recording Rules: Aggregations
└── Federation: Future multi-cluster
```

### Visualization
```yaml
Grafana Dashboards:
├── EVM Overview: High-level metrics
├── Node Health: Detailed node status
├── Network: P2P and sync status
├── Resource Usage: CPU, memory, storage
└── Alerts: Active alert management
```

## 🔮 Future Enhancements

### Planned Improvements
1. **Multi-region deployment**
2. **Advanced monitoring**
3. **Automated backup**
4. **Security hardening**
5. **Performance optimization**

### Scalability Roadmap
1. **Horizontal scaling**: Multi-pod deployment
2. **Cluster federation**: Multi-region clusters
3. **Advanced networking**: Service mesh
4. **Automated operations**: GitOps workflow
5. **Enterprise features**: Advanced security

This architecture provides a solid foundation for a production-ready EVM deployment with room for future enhancements and scaling.