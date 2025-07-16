// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SimpleDEX is ReentrancyGuard, Ownable, Pausable {
    IERC20 public token;
    uint256 public constant EXCHANGE_RATE = 1000; // 1 ETH = 1000 tokens
    uint256 public constant FEE_PERCENTAGE = 30; // 0.3% fee
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    uint256 public totalEthLiquidity;
    uint256 public totalTokenLiquidity;
    uint256 public feesCollected;
    
    mapping(address => uint256) public ethBalances;
    mapping(address => uint256) public tokenBalances;
    
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 fee);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount, uint256 fee);
    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event FeesWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "SimpleDEX: token cannot be zero address");
        token = IERC20(_token);
    }
    
    function buyTokens() external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "SimpleDEX: must send ETH to buy tokens");
        
        uint256 fee = (msg.value * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 ethAfterFee = msg.value - fee;
        uint256 tokenAmount = ethAfterFee * EXCHANGE_RATE;
        
        require(token.balanceOf(address(this)) >= tokenAmount, "SimpleDEX: insufficient token liquidity");
        
        feesCollected += fee;
        totalEthLiquidity += ethAfterFee;
        totalTokenLiquidity -= tokenAmount;
        
        require(token.transfer(msg.sender, tokenAmount), "SimpleDEX: token transfer failed");
        
        emit TokensPurchased(msg.sender, ethAfterFee, tokenAmount, fee);
    }
    
    function sellTokens(uint256 tokenAmount) external nonReentrant whenNotPaused {
        require(tokenAmount > 0, "SimpleDEX: must specify token amount");
        require(token.balanceOf(msg.sender) >= tokenAmount, "SimpleDEX: insufficient token balance");
        
        uint256 ethAmount = tokenAmount / EXCHANGE_RATE;
        uint256 fee = (ethAmount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 ethAfterFee = ethAmount - fee;
        
        require(address(this).balance >= ethAfterFee, "SimpleDEX: insufficient ETH liquidity");
        
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "SimpleDEX: token transfer failed");
        
        feesCollected += fee;
        totalEthLiquidity -= ethAfterFee;
        totalTokenLiquidity += tokenAmount;
        
        payable(msg.sender).transfer(ethAfterFee);
        
        emit TokensSold(msg.sender, tokenAmount, ethAfterFee, fee);
    }
    
    function addLiquidity(uint256 tokenAmount) external payable onlyOwner {
        require(msg.value > 0, "SimpleDEX: must send ETH");
        require(tokenAmount > 0, "SimpleDEX: must send tokens");
        
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "SimpleDEX: token transfer failed");
        
        totalEthLiquidity += msg.value;
        totalTokenLiquidity += tokenAmount;
        
        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
    }
    
    function removeLiquidity(uint256 ethAmount, uint256 tokenAmount) external onlyOwner {
        require(ethAmount <= totalEthLiquidity, "SimpleDEX: insufficient ETH liquidity");
        require(tokenAmount <= totalTokenLiquidity, "SimpleDEX: insufficient token liquidity");
        
        totalEthLiquidity -= ethAmount;
        totalTokenLiquidity -= tokenAmount;
        
        if (ethAmount > 0) {
            payable(msg.sender).transfer(ethAmount);
        }
        
        if (tokenAmount > 0) {
            require(token.transfer(msg.sender, tokenAmount), "SimpleDEX: token transfer failed");
        }
        
        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount);
    }
    
    function withdrawFees() external onlyOwner {
        uint256 amount = feesCollected;
        feesCollected = 0;
        
        payable(msg.sender).transfer(amount);
        
        emit FeesWithdrawn(msg.sender, amount);
    }
    
    function getTokenPrice() external pure returns (uint256) {
        return 1 ether / EXCHANGE_RATE;
    }
    
    function getEthPrice() external pure returns (uint256) {
        return EXCHANGE_RATE;
    }
    
    function getLiquidityInfo() external view returns (uint256 ethLiquidity, uint256 tokenLiquidity, uint256 fees) {
        return (totalEthLiquidity, totalTokenLiquidity, feesCollected);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        uint256 tokenBalance = token.balanceOf(address(this));
        
        if (ethBalance > 0) {
            payable(msg.sender).transfer(ethBalance);
        }
        
        if (tokenBalance > 0) {
            require(token.transfer(msg.sender, tokenBalance), "SimpleDEX: token transfer failed");
        }
    }
    
    receive() external payable {
        buyTokens();
    }
}