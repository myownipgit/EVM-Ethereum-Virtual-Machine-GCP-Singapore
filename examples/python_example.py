#!/usr/bin/env python3
"""
Python example for interacting with the EVM deployment
Requires: pip install web3
"""

from web3 import Web3
import json
import time
from typing import Dict, Any

# Connect to local EVM node
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

# Pre-funded test accounts
TEST_ACCOUNTS = {
    'account1': '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',  # 100 ETH
    'account2': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',    # 50 ETH
    'account3': '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',  # 25 ETH
    'account4': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',  # 10 ETH
    'account5': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'   # 5 ETH
}

def check_connection() -> bool:
    """Check if connected to EVM node"""
    try:
        print("🔗 Checking EVM connection...")
        is_connected = w3.is_connected()
        print(f"✅ Connected: {is_connected}")
        
        if is_connected:
            block_number = w3.eth.block_number
            network_id = w3.net.version
            print(f"📡 Network ID: {network_id}")
            print(f"📦 Latest Block: {block_number}")
        
        return is_connected
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def get_account_balances() -> Dict[str, float]:
    """Get balances for all test accounts"""
    print("\n💰 Account Balances:")
    balances = {}
    
    for name, address in TEST_ACCOUNTS.items():
        try:
            balance_wei = w3.eth.get_balance(address)
            balance_eth = w3.from_wei(balance_wei, 'ether')
            balances[name] = float(balance_eth)
            print(f"   {name}: {balance_eth} ETH")
        except Exception as e:
            print(f"   ❌ Error getting balance for {name}: {e}")
            balances[name] = 0.0
    
    return balances

def send_transaction(from_account: str, to_account: str, amount_eth: float) -> str:
    """Send ETH transaction between accounts"""
    try:
        print(f"\n💸 Sending {amount_eth} ETH from {from_account} to {to_account}...")
        
        # Build transaction
        transaction = {
            'from': TEST_ACCOUNTS[from_account],
            'to': TEST_ACCOUNTS[to_account],
            'value': w3.to_wei(amount_eth, 'ether'),
            'gas': 21000,
            'gasPrice': w3.to_wei('20', 'gwei')
        }
        
        # Send transaction
        tx_hash = w3.eth.send_transaction(transaction)
        print(f"📝 Transaction hash: {tx_hash.hex()}")
        
        # Wait for receipt
        print("⏳ Waiting for confirmation...")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        print(f"✅ Transaction confirmed in block {receipt.blockNumber}")
        print(f"⛽ Gas used: {receipt.gasUsed}")
        
        return tx_hash.hex()
    
    except Exception as e:
        print(f"❌ Transaction failed: {e}")
        return ""

def deploy_simple_contract() -> str:
    """Deploy a simple storage contract"""
    print("\n📝 Deploying Smart Contract...")
    
    # Simple storage contract ABI
    contract_abi = [
        {
            "inputs": [],
            "name": "get",
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"name": "_value", "type": "uint256"}],
            "name": "set",
            "outputs": [],
            "stateMutability": "nonpayable", 
            "type": "function"
        }
    ]
    
    # Contract bytecode (simple storage contract)
    contract_bytecode = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea26469706673582212207f6d9a1c8a5c4d2e8b9f6a3c1e8f7d6b9c2a5e8f1d4b7a9c6e3f2d5c8b0a1e4f90064736f6c634300080f0033"
    
    try:
        # Create contract instance
        contract = w3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)
        
        # Deploy contract
        transaction = contract.constructor().build_transaction({
            'from': TEST_ACCOUNTS['account1'],
            'gas': 1500000,
            'gasPrice': w3.to_wei('20', 'gwei')
        })
        
        # Send deployment transaction
        tx_hash = w3.eth.send_transaction(transaction)
        print(f"🚀 Deployment transaction: {tx_hash.hex()}")
        
        # Wait for deployment
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = receipt.contractAddress
        
        print(f"✅ Contract deployed at: {contract_address}")
        print(f"⛽ Gas used: {receipt.gasUsed}")
        
        return contract_address
    
    except Exception as e:
        print(f"❌ Contract deployment failed: {e}")
        return ""

def interact_with_contract(contract_address: str):
    """Interact with deployed contract"""
    print(f"\n🔄 Interacting with contract at {contract_address}...")
    
    contract_abi = [
        {
            "inputs": [],
            "name": "get",
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"name": "_value", "type": "uint256"}],
            "name": "set",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
    
    try:
        # Create contract instance
        contract = w3.eth.contract(address=contract_address, abi=contract_abi)
        
        # Read current value
        current_value = contract.functions.get().call()
        print(f"📖 Current stored value: {current_value}")
        
        # Set new value
        new_value = 42
        print(f"📝 Setting value to {new_value}...")
        
        transaction = contract.functions.set(new_value).build_transaction({
            'from': TEST_ACCOUNTS['account1'],
            'gas': 100000,
            'gasPrice': w3.to_wei('20', 'gwei')
        })
        
        tx_hash = w3.eth.send_transaction(transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        print(f"✅ Value set in transaction: {tx_hash.hex()}")
        
        # Read updated value
        updated_value = contract.functions.get().call()
        print(f"📖 Updated stored value: {updated_value}")
        
    except Exception as e:
        print(f"❌ Contract interaction failed: {e}")

def monitor_blocks(duration_seconds: int = 30):
    """Monitor new blocks for specified duration"""
    print(f"\n👁️ Monitoring blocks for {duration_seconds} seconds...")
    
    start_time = time.time()
    last_block = w3.eth.block_number
    
    try:
        while time.time() - start_time < duration_seconds:
            current_block = w3.eth.block_number
            
            if current_block > last_block:
                block = w3.eth.get_block(current_block)
                print(f"🆕 New block {current_block}: {len(block.transactions)} transactions")
                last_block = current_block
            
            time.sleep(2)  # Check every 2 seconds
        
        print("✅ Block monitoring completed")
    
    except KeyboardInterrupt:
        print("\n⏹️ Block monitoring stopped by user")
    except Exception as e:
        print(f"❌ Block monitoring error: {e}")

def get_network_stats():
    """Get various network statistics"""
    print("\n📊 Network Statistics:")
    
    try:
        # Basic info
        block_number = w3.eth.block_number
        gas_price = w3.eth.gas_price
        
        print(f"   📦 Latest block: {block_number}")
        print(f"   ⛽ Gas price: {w3.from_wei(gas_price, 'gwei')} Gwei")
        
        # Block info
        latest_block = w3.eth.get_block('latest')
        print(f"   🕐 Block timestamp: {latest_block.timestamp}")
        print(f"   💼 Transactions in block: {len(latest_block.transactions)}")
        print(f"   ⛽ Gas used: {latest_block.gasUsed:,}")
        print(f"   ⛽ Gas limit: {latest_block.gasLimit:,}")
        
        # Chain info
        chain_id = w3.eth.chain_id
        print(f"   🔗 Chain ID: {chain_id}")
        
    except Exception as e:
        print(f"   ❌ Error getting network stats: {e}")

def main():
    """Main function to run all examples"""
    print("🚀 Python EVM Examples\n")
    
    # Check connection
    if not check_connection():
        print("❌ Cannot connect to EVM. Make sure it's running.")
        return
    
    # Get initial balances
    initial_balances = get_account_balances()
    
    # Send a transaction
    tx_hash = send_transaction('account1', 'account2', 0.5)
    
    if tx_hash:
        # Get updated balances
        print("\n💰 Updated Balances:")
        updated_balances = get_account_balances()
    
    # Deploy and interact with contract
    contract_address = deploy_simple_contract()
    if contract_address:
        interact_with_contract(contract_address)
    
    # Get network statistics
    get_network_stats()
    
    # Monitor blocks briefly
    print("\n👁️ Brief block monitoring...")
    monitor_blocks(10)
    
    print("\n✨ Python examples completed!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")