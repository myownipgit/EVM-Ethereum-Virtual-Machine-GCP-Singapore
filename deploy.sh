#!/bin/bash

# EVM Deployment Script for GCP Singapore
# This script automates the complete deployment of Nethermind EVM on GCP

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="analog-patrol-458417-b5"
REGION="asia-southeast1"
ZONE="asia-southeast1-a"
CLUSTER_NAME="ethereum-cluster"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Function to wait for deployment
wait_for_deployment() {
    local namespace=$1
    local deployment=$2
    local timeout=${3:-300}
    
    print_status "Waiting for deployment $deployment in namespace $namespace..."
    
    if kubectl wait --for=condition=available --timeout=${timeout}s deployment/$deployment -n $namespace; then
        print_success "Deployment $deployment is ready"
    else
        print_error "Deployment $deployment failed to become ready within ${timeout}s"
        exit 1
    fi
}

# Function to get external IP
get_external_ip() {
    local service=$1
    local namespace=$2
    
    print_status "Getting external IP for service $service..."
    
    # Wait for external IP to be assigned
    local external_ip=""
    local count=0
    local max_attempts=60
    
    while [ -z "$external_ip" ] && [ $count -lt $max_attempts ]; do
        external_ip=$(kubectl get svc $service -n $namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
        if [ -z "$external_ip" ]; then
            print_status "Waiting for external IP assignment... (attempt $((count + 1))/$max_attempts)"
            sleep 10
            ((count++))
        fi
    done
    
    if [ -n "$external_ip" ]; then
        print_success "External IP: $external_ip"
        echo "$external_ip"
    else
        print_error "Failed to get external IP after $max_attempts attempts"
        return 1
    fi
}

# Main deployment function
main() {
    print_status "Starting EVM deployment on GCP Singapore..."
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_command "gcloud"
    check_command "kubectl"
    check_command "docker"
    
    # Set up GCP project
    print_status "Setting up GCP project..."
    gcloud config set project $PROJECT_ID
    
    # Run GCP setup if cluster doesn't exist
    if ! gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE &>/dev/null; then
        print_status "GKE cluster not found. Running GCP setup..."
        ./gcp-setup.sh
    else
        print_success "GKE cluster already exists"
        gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
    fi
    
    # Create namespace if it doesn't exist
    if ! kubectl get namespace ethereum &>/dev/null; then
        print_status "Creating ethereum namespace..."
        kubectl create namespace ethereum
    else
        print_success "Ethereum namespace already exists"
    fi
    
    # Deploy storage resources
    print_status "Deploying storage resources..."
    kubectl apply -f k8s/storage.yaml
    
    # Deploy configuration
    print_status "Deploying configuration..."
    kubectl apply -f k8s/configmap.yaml
    
    # Deploy Nethermind
    print_status "Deploying Nethermind EVM..."
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    
    # Wait for Nethermind deployment
    wait_for_deployment "ethereum" "nethermind-evm" 600
    
    # Deploy monitoring
    print_status "Deploying monitoring stack..."
    kubectl apply -f k8s/monitoring.yaml
    
    # Wait for monitoring deployments
    wait_for_deployment "ethereum" "prometheus" 300
    wait_for_deployment "ethereum" "grafana" 300
    
    # Get service endpoints
    print_status "Getting service endpoints..."
    
    NETHERMIND_IP=$(get_external_ip "nethermind-service" "ethereum")
    PROMETHEUS_IP=$(get_external_ip "prometheus-service" "ethereum")
    GRAFANA_IP=$(get_external_ip "grafana-service" "ethereum")
    
    # Test connectivity
    print_status "Testing EVM connectivity..."
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        http://$NETHERMIND_IP:8545 > /dev/null; then
        print_success "EVM RPC endpoint is responding"
    else
        print_warning "EVM RPC endpoint not yet ready (this is normal during initial sync)"
    fi
    
    # Display deployment information
    echo
    echo "==============================================="
    echo "🎉 EVM Deployment Complete!"
    echo "==============================================="
    echo
    echo "📊 Service Endpoints:"
    echo "   • Nethermind RPC:  http://$NETHERMIND_IP:8545"
    echo "   • Nethermind WS:   ws://$NETHERMIND_IP:8546"
    echo "   • Prometheus:      http://$PROMETHEUS_IP:9090"
    echo "   • Grafana:         http://$GRAFANA_IP:3000"
    echo
    echo "🔐 Default Credentials:"
    echo "   • Grafana: admin/admin"
    echo
    echo "📋 Quick Commands:"
    echo "   • Check status:    kubectl get pods -n ethereum"
    echo "   • View logs:       kubectl logs -f deployment/nethermind-evm -n ethereum"
    echo "   • Scale up:        kubectl scale deployment/nethermind-evm --replicas=2 -n ethereum"
    echo
    echo "🧪 Test the deployment:"
    echo "   curl -X POST -H \"Content-Type: application/json\" \\"
    echo "     --data '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}' \\"
    echo "     http://$NETHERMIND_IP:8545"
    echo
    echo "💰 Estimated Monthly Cost: ~\$924"
    echo "📍 Region: Asia Southeast 1 (Singapore)"
    echo "==============================================="
    
    # Save deployment info
    cat > deployment-info.txt << EOF
EVM Deployment Information
=========================

Deployment Date: $(date)
Project ID: $PROJECT_ID
Region: $REGION
Zone: $ZONE
Cluster: $CLUSTER_NAME

Service Endpoints:
- Nethermind RPC: http://$NETHERMIND_IP:8545
- Nethermind WS: ws://$NETHERMIND_IP:8546
- Prometheus: http://$PROMETHEUS_IP:9090
- Grafana: http://$GRAFANA_IP:3000

Test Wallets:
- 0x742d35Cc6634C0532925a3b844Bc454e4438f44e (100 ETH)
- 0x8ba1f109551bD432803012645Ac136cc22C57B (50 ETH)
- 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (25 ETH)

Management Commands:
- kubectl get pods -n ethereum
- kubectl logs -f deployment/nethermind-evm -n ethereum
- kubectl scale deployment/nethermind-evm --replicas=2 -n ethereum
EOF
    
    print_success "Deployment information saved to deployment-info.txt"
}

# Handle script arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    status)
        kubectl get pods -n ethereum
        kubectl get svc -n ethereum
        ;;
    logs)
        kubectl logs -f deployment/nethermind-evm -n ethereum
        ;;
    clean)
        print_warning "This will delete all resources. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            kubectl delete namespace ethereum
            print_success "Resources cleaned up"
        fi
        ;;
    *)
        echo "Usage: $0 {deploy|status|logs|clean}"
        echo "  deploy  - Deploy EVM to GCP (default)"
        echo "  status  - Show deployment status"
        echo "  logs    - Show Nethermind logs"
        echo "  clean   - Clean up all resources"
        ;;
esac