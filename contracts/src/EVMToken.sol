// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract EVMToken is ERC20, Ownable, Pausable {
    uint256 private constant INITIAL_SUPPLY = 1000000 * 10**18;
    uint256 private constant MAX_SUPPLY = 10000000 * 10**18;
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    modifier onlyMinter() {
        require(minters[msg.sender], "EVMToken: caller is not a minter");
        _;
    }
    
    constructor() ERC20("EVM Token", "EVMT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        minters[msg.sender] = true;
    }
    
    function mint(address to, uint256 amount) public onlyMinter whenNotPaused {
        require(totalSupply() + amount <= MAX_SUPPLY, "EVMToken: minting would exceed max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    function burn(uint256 amount) public whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    function burnFrom(address account, uint256 amount) public whenNotPaused {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }
    
    function addMinter(address minter) public onlyOwner {
        require(minter != address(0), "EVMToken: minter cannot be zero address");
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    function removeMinter(address minter) public onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    function getMaxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }
    
    function getRemainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}