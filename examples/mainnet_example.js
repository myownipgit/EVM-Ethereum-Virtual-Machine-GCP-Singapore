// Mainnet EVM Example
// This example works with the mainnet fork without requiring pre-funded accounts

const { Web3 } = require('web3');

// Connect to local EVM node (mainnet fork)
const web3 = new Web3('http://localhost:8545');

// Famous Ethereum addresses with known balances
const famousAddresses = {
  'Vitalik Buterin': '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  'Ethereum Foundation': '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
  'Uniswap V2 Router': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  'USDC Contract': '0xA0b86a33E6441C84C02c10BCF4e5Ba63A4B9cd2e8',
  'Binance Hot Wallet': '0x28C6c06298d514Db089934071355E5743bf21d60'
};

async function exploreMainnet() {
  console.log('🌍 Exploring Ethereum Mainnet Fork\n');
  
  try {
    // Network information
    console.log('📡 Network Information:');
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.getChainId();
    const blockNumber = await web3.eth.getBlockNumber();
    const gasPrice = await web3.eth.getGasPrice();
    
    console.log(`   Network ID: ${networkId}`);
    console.log(`   Chain ID: ${chainId}`);
    console.log(`   Latest Block: ${blockNumber}`);
    console.log(`   Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei\n`);
    
    // Check famous addresses
    console.log('💰 Famous Address Balances:');
    for (const [name, address] of Object.entries(famousAddresses)) {
      try {
        const balance = await web3.eth.getBalance(address);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        const rounded = parseFloat(ethBalance).toFixed(4);
        console.log(`   ${name}: ${rounded} ETH`);
      } catch (error) {
        console.log(`   ${name}: Error fetching balance`);
      }
    }
    
    // Latest block details
    console.log('\n📦 Latest Block Details:');
    const latestBlock = await web3.eth.getBlock('latest', true);
    console.log(`   Block Number: ${latestBlock.number}`);
    console.log(`   Block Hash: ${latestBlock.hash}`);
    console.log(`   Transactions: ${latestBlock.transactions.length}`);
    console.log(`   Gas Used: ${latestBlock.gasUsed.toLocaleString()}`);
    console.log(`   Gas Limit: ${latestBlock.gasLimit.toLocaleString()}`);
    console.log(`   Timestamp: ${new Date(Number(latestBlock.timestamp) * 1000)}`);
    
    // Sync status
    console.log('\n🔄 Sync Status:');
    const syncing = await web3.eth.isSyncing();
    if (syncing) {
      console.log(`   Status: Syncing`);
      console.log(`   Current Block: ${syncing.currentBlock}`);
      console.log(`   Highest Block: ${syncing.highestBlock}`);
      const progress = (syncing.currentBlock / syncing.highestBlock * 100).toFixed(2);
      console.log(`   Progress: ${progress}%`);
    } else {
      console.log(`   Status: Fully Synced ✅`);
    }
    
    // Peer information
    console.log('\n👥 Network Peers:');
    const peerCount = await web3.eth.net.getPeerCount();
    console.log(`   Connected Peers: ${peerCount}`);
    
  } catch (error) {
    console.error('❌ Error exploring mainnet:', error.message);
  }
}

async function checkContractExample() {
  console.log('\n📋 Smart Contract Example:');
  
  // USDC contract (widely used stablecoin)
  const usdcAddress = '0xA0b86a33E6441C84C02c10BCF4e5Ba63A4B9cd2e8';
  const usdcABI = [
    {
      "name": "totalSupply",
      "type": "function",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view"
    },
    {
      "name": "decimals",
      "type": "function", 
      "inputs": [],
      "outputs": [{"name": "", "type": "uint8"}],
      "stateMutability": "view"
    },
    {
      "name": "symbol",
      "type": "function",
      "inputs": [],
      "outputs": [{"name": "", "type": "string"}],
      "stateMutability": "view"
    },
    {
      "name": "balanceOf",
      "type": "function",
      "inputs": [{"name": "account", "type": "address"}],
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view"
    }
  ];
  
  try {
    // Check if contract exists
    const code = await web3.eth.getCode(usdcAddress);
    if (code === '0x') {
      console.log('   ⚠️ USDC contract not found (might be empty fork)');
      return;
    }
    
    const usdcContract = new web3.eth.Contract(usdcABI, usdcAddress);
    
    // Get contract information
    const symbol = await usdcContract.methods.symbol().call();
    const decimals = await usdcContract.methods.decimals().call();
    const totalSupply = await usdcContract.methods.totalSupply().call();
    
    console.log(`   Contract: ${symbol}`);
    console.log(`   Address: ${usdcAddress}`);
    console.log(`   Decimals: ${decimals}`);
    
    // Format total supply
    const formattedSupply = (Number(totalSupply) / Math.pow(10, Number(decimals))).toLocaleString();
    console.log(`   Total Supply: ${formattedSupply} ${symbol}`);
    
    // Check balance of a known holder
    const binanceAddress = '0x28C6c06298d514Db089934071355E5743bf21d60';
    const balance = await usdcContract.methods.balanceOf(binanceAddress).call();
    const formattedBalance = (Number(balance) / Math.pow(10, Number(decimals))).toLocaleString();
    console.log(`   Binance Hot Wallet Balance: ${formattedBalance} ${symbol}`);
    
  } catch (error) {
    console.log(`   ❌ Contract interaction failed: ${error.message}`);
  }
}

async function monitorBlocks(duration = 20) {
  console.log(`\n👀 Monitoring Blocks (${duration}s):`);
  
  let lastBlock = await web3.eth.getBlockNumber();
  const startTime = Date.now();
  
  const interval = setInterval(async () => {
    try {
      const currentBlock = await web3.eth.getBlockNumber();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      if (currentBlock > lastBlock) {
        const block = await web3.eth.getBlock(currentBlock);
        console.log(`   [${elapsed}s] New Block ${currentBlock}: ${block.transactions.length} txs`);
        lastBlock = currentBlock;
      } else {
        console.log(`   [${elapsed}s] No new blocks yet...`);
      }
      
      if (elapsed >= duration) {
        clearInterval(interval);
        console.log('   ✅ Block monitoring completed');
      }
    } catch (error) {
      console.log(`   ❌ Monitoring error: ${error.message}`);
      clearInterval(interval);
    }
  }, 3000);
}

async function main() {
  console.log('🚀 Mainnet EVM Explorer\n');
  
  // Check connection first
  try {
    const isConnected = await web3.eth.net.isListening();
    if (!isConnected) {
      console.log('❌ Cannot connect to EVM. Make sure it\'s running.');
      return;
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return;
  }
  
  await exploreMainnet();
  await checkContractExample();
  await monitorBlocks(15);
  
  console.log('\n✨ Mainnet exploration completed!');
}

// Only run if this file is executed directly
if (require.main === module) {
  main().then(() => {
    setTimeout(() => process.exit(0), 2000);
  }).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  exploreMainnet,
  checkContractExample,
  monitorBlocks
};