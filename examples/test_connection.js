// Quick connection test for EVM node
const { Web3 } = require('web3');

async function testConnection() {
  console.log('🔍 Testing EVM Connection...\n');
  
  const web3 = new Web3('http://localhost:8545');
  
  try {
    // Test basic connectivity
    console.log('1. Testing basic connectivity...');
    const isListening = await web3.eth.net.isListening();
    console.log(`   ✅ Node listening: ${isListening}`);
    
    // Get network info
    console.log('2. Getting network information...');
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.getChainId();
    console.log(`   📡 Network ID: ${networkId}`);
    console.log(`   🔗 Chain ID: ${chainId}`);
    
    // Get latest block
    console.log('3. Checking latest block...');
    const blockNumber = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock('latest');
    console.log(`   📦 Block number: ${blockNumber}`);
    console.log(`   🕐 Block timestamp: ${new Date(Number(block.timestamp) * 1000)}`);
    
    // Check sync status
    console.log('4. Checking sync status...');
    const syncing = await web3.eth.isSyncing();
    if (syncing) {
      console.log(`   🔄 Syncing: ${syncing.currentBlock}/${syncing.highestBlock}`);
    } else {
      console.log(`   ✅ Fully synced`);
    }
    
    // Get peer count
    console.log('5. Checking peer connections...');
    const peerCount = await web3.eth.net.getPeerCount();
    console.log(`   👥 Connected peers: ${peerCount}`);
    
    // Test account balance
    console.log('6. Testing account balance...');
    const testAccount = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const balance = await web3.eth.getBalance(testAccount);
    const ethBalance = web3.utils.fromWei(balance, 'ether');
    console.log(`   💰 Test account balance: ${ethBalance} ETH`);
    
    // Test gas price
    console.log('7. Getting gas price...');
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceGwei = web3.utils.fromWei(gasPrice, 'gwei');
    console.log(`   ⛽ Current gas price: ${gasPriceGwei} Gwei`);
    
    console.log('\n🎉 All tests passed! EVM is ready for use.');
    return true;
    
  } catch (error) {
    console.log('\n❌ Connection test failed:');
    console.log(`   Error: ${error.message}`);
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure Docker containers are running: docker-compose ps');
    console.log('   2. Check if port 8545 is accessible: curl http://localhost:8545');
    console.log('   3. View logs: docker-compose logs nethermind');
    console.log('   4. Restart services: docker-compose restart');
    
    return false;
  }
}

// Test WebSocket connection
async function testWebSocket() {
  console.log('\n🔌 Testing WebSocket connection...');
  
  try {
    const wsWeb3 = new Web3('ws://localhost:8546');
    
    // Test subscription with await
    const subscription = await wsWeb3.eth.subscribe('newBlockHeaders');
    
    subscription.on('data', (blockHeader) => {
      console.log(`   📦 New block via WebSocket: ${blockHeader.number}`);
      subscription.unsubscribe();
      console.log('   ✅ WebSocket test successful');
    });
    
    subscription.on('error', (error) => {
      console.log(`   ❌ WebSocket error: ${error.message}`);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      try {
        subscription.unsubscribe();
        console.log('   ⏰ WebSocket test timeout (no new blocks)');
      } catch (e) {
        console.log('   ⏰ WebSocket test completed');
      }
    }, 10000);
    
  } catch (error) {
    console.log(`   ❌ WebSocket connection failed: ${error.message}`);
    console.log('   💡 Tip: WebSocket may not be enabled or accessible');
  }
}

// Quick health check
async function quickHealthCheck() {
  console.log('⚡ Quick Health Check...\n');
  
  const web3 = new Web3('http://localhost:8545');
  
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log(`✅ EVM is running (Block: ${blockNumber})`);
    return true;
  } catch (error) {
    console.log(`❌ EVM not accessible: ${error.message}`);
    return false;
  }
}

// Run based on command line arguments
async function main() {
  const arg = process.argv[2];
  
  switch (arg) {
    case 'quick':
      await quickHealthCheck();
      break;
    case 'ws':
      await testWebSocket();
      break;
    case 'full':
    default:
      const success = await testConnection();
      if (success) {
        await testWebSocket();
      }
      break;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().then(() => {
    setTimeout(() => process.exit(0), 2000); // Give time for async operations
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  testConnection,
  testWebSocket,
  quickHealthCheck
};