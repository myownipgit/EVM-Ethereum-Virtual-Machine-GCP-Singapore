const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EVMToken", function () {
  let evmToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    const EVMToken = await ethers.getContractFactory("EVMToken");
    evmToken = await EVMToken.deploy();
    await evmToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await evmToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await evmToken.balanceOf(owner.address);
      expect(await evmToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct token metadata", async function () {
      expect(await evmToken.name()).to.equal("EVM Token");
      expect(await evmToken.symbol()).to.equal("EVMT");
      expect(await evmToken.decimals()).to.equal(18);
    });

    it("Should set owner as initial minter", async function () {
      expect(await evmToken.minters(owner.address)).to.equal(true);
    });
  });

  describe("Minting", function () {
    it("Should allow minters to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await evmToken.mint(addr1.address, mintAmount);
      
      expect(await evmToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-minters to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      
      await expect(
        evmToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("EVMToken: caller is not a minter");
    });

    it("Should not allow minting beyond max supply", async function () {
      const maxSupply = await evmToken.getMaxSupply();
      const currentSupply = await evmToken.totalSupply();
      const excessAmount = maxSupply.sub(currentSupply).add(1);
      
      await expect(
        evmToken.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("EVMToken: minting would exceed max supply");
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const burnAmount = ethers.utils.parseEther("1000");
      const initialBalance = await evmToken.balanceOf(owner.address);
      
      await evmToken.burn(burnAmount);
      
      expect(await evmToken.balanceOf(owner.address)).to.equal(
        initialBalance.sub(burnAmount)
      );
    });

    it("Should allow approved burning from another account", async function () {
      const burnAmount = ethers.utils.parseEther("1000");
      
      await evmToken.approve(addr1.address, burnAmount);
      await evmToken.connect(addr1).burnFrom(owner.address, burnAmount);
      
      expect(await evmToken.balanceOf(owner.address)).to.equal(
        ethers.utils.parseEther("999000")
      );
    });
  });

  describe("Minter Management", function () {
    it("Should allow owner to add minters", async function () {
      await evmToken.addMinter(addr1.address);
      expect(await evmToken.minters(addr1.address)).to.equal(true);
    });

    it("Should allow owner to remove minters", async function () {
      await evmToken.addMinter(addr1.address);
      await evmToken.removeMinter(addr1.address);
      expect(await evmToken.minters(addr1.address)).to.equal(false);
    });

    it("Should not allow non-owners to add minters", async function () {
      await expect(
        evmToken.connect(addr1).addMinter(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      await evmToken.pause();
      expect(await evmToken.paused()).to.equal(true);
      
      await evmToken.unpause();
      expect(await evmToken.paused()).to.equal(false);
    });

    it("Should prevent transfers when paused", async function () {
      await evmToken.pause();
      
      await expect(
        evmToken.transfer(addr1.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Supply Functions", function () {
    it("Should return correct max supply", async function () {
      expect(await evmToken.getMaxSupply()).to.equal(
        ethers.utils.parseEther("10000000")
      );
    });

    it("Should return correct remaining supply", async function () {
      const maxSupply = await evmToken.getMaxSupply();
      const totalSupply = await evmToken.totalSupply();
      const remainingSupply = await evmToken.getRemainingSupply();
      
      expect(remainingSupply).to.equal(maxSupply.sub(totalSupply));
    });
  });
});