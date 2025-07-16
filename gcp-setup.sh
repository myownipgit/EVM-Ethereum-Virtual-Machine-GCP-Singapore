#!/bin/bash

# GCP EVM Deployment Setup Script
# This script sets up the GCP infrastructure for EVM deployment in Singapore

set -e

# Configuration
PROJECT_ID="analog-patrol-458417-b5"
REGION="asia-southeast1"
ZONE="asia-southeast1-a"
CLUSTER_NAME="ethereum-cluster"
NETWORK_NAME="ethereum-vpc"
SUBNET_NAME="ethereum-subnet"

echo "🚀 Setting up GCP EVM deployment in Singapore..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install Google Cloud SDK first."
    exit 1
fi

# Authenticate and set project
echo "🔐 Authenticating with GCP..."
gcloud auth login
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Create VPC network
echo "🌐 Creating VPC network..."
gcloud compute networks create $NETWORK_NAME \
    --subnet-mode=custom \
    --bgp-routing-mode=regional

# Create subnet in Singapore
echo "🌏 Creating subnet in Singapore region..."
gcloud compute networks subnets create $SUBNET_NAME \
    --network=$NETWORK_NAME \
    --range=10.0.0.0/24 \
    --region=$REGION

# Create firewall rules for Ethereum P2P
echo "🔥 Creating firewall rules for P2P traffic..."
gcloud compute firewall-rules create ethereum-p2p \
    --network=$NETWORK_NAME \
    --allow=tcp:30303,udp:30303 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=ethereum-node \
    --description="Allow Ethereum P2P traffic"

# Create firewall rules for RPC (restricted)
echo "🔥 Creating firewall rules for RPC traffic..."
gcloud compute firewall-rules create ethereum-rpc \
    --network=$NETWORK_NAME \
    --allow=tcp:8545,tcp:8546 \
    --source-ranges=10.0.0.0/8 \
    --target-tags=ethereum-node \
    --description="Allow Ethereum RPC traffic from internal network"

# Create GKE cluster
echo "☸️ Creating GKE cluster..."
gcloud container clusters create $CLUSTER_NAME \
    --zone=$ZONE \
    --machine-type=e2-standard-8 \
    --num-nodes=2 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=3 \
    --disk-size=100GB \
    --disk-type=pd-ssd \
    --enable-network-policy \
    --enable-ip-alias \
    --network=$NETWORK_NAME \
    --subnetwork=$SUBNET_NAME \
    --logging=SYSTEM,WORKLOAD \
    --monitoring=SYSTEM \
    --tags=ethereum-node

# Get cluster credentials
echo "🔑 Getting cluster credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE

# Create Kubernetes namespace
echo "📦 Creating Kubernetes namespace..."
kubectl create namespace ethereum

# Create storage class for SSD
echo "💾 Creating storage class..."
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ssd-regional
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
  zones: ${ZONE}
  replication-type: regional-pd
allowVolumeExpansion: true
EOF

echo "✅ GCP infrastructure setup complete!"
echo "🔗 Cluster endpoint: $(gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE --format='value(endpoint)')"
echo "📊 Monitor at: https://console.cloud.google.com/kubernetes/workload?project=$PROJECT_ID"