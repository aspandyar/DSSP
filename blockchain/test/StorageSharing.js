const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("StorageSharing", function () {
  async function deployStorageSharingFixture() {
      const socket = "example.socket:1234";
      const maxStorage = 1000;

      const [owner, otherAccount] = await ethers.getSigners();

      const StorageSharing = await ethers.getContractFactory("StorageSharing");
      const storageSharing = await StorageSharing.deploy();

      return { storageSharing, socket, maxStorage, owner, otherAccount };
  }

  describe("Deployment", function () {
      it("Should deploy the StorageSharing contract successfully", async function () {
          const { storageSharing } = await loadFixture(deployStorageSharingFixture);
          expect(storageSharing.address).to.properAddress;
      });

      it("Should set the right owner", async function () {
          const { storageSharing, owner } = await loadFixture(deployStorageSharingFixture);
          expect(await storageSharing.servers(0)).to.equal(owner.address); // Adjusted to access owner property properly
      });
  });

  describe("Public Server Creation", function () {
      it("Should create a public server with correct parameters", async function () {
          const { storageSharing, socket, maxStorage, owner } = await loadFixture(deployStorageSharingFixture);
          
          const price = ethers.utils.parseEther("0.01"); // 0.01 Ether in wei
          const tx = await storageSharing.publicServer(socket, maxStorage, { value: price });

          await expect(tx).to.emit(storageSharing, "PublicServerCreated")
              .withArgs(owner.address, socket, maxStorage, price, anyValue);
      });

      it("Should revert if the socket is empty", async function () {
          const { storageSharing, maxStorage } = await loadFixture(deployStorageSharingFixture);
          const price = ethers.utils.parseEther("0.01"); // 0.01 Ether in wei
          await expect(storageSharing.publicServer("", maxStorage, { value: price })).to.be.revertedWith("Socket is required");
      });

      it("Should revert if maxStorage is 0", async function () {
          const { storageSharing, socket } = await loadFixture(deployStorageSharingFixture);
          const price = ethers.utils.parseEther("0.01"); // 0.01 Ether in wei
          await expect(storageSharing.publicServer(socket, 0, { value: price })).to.be.revertedWith("Max storage is required");
      });

      it("Should revert if incorrect Ether amount is sent", async function () {
          const { storageSharing, socket, maxStorage } = await loadFixture(deployStorageSharingFixture);
          const incorrectPrice = ethers.utils.parseEther("0.005"); // Less than required
          await expect(storageSharing.publicServer(socket, maxStorage, { value: incorrectPrice })).to.be.revertedWith("Incorrect value sent, required 0.01 ether");
      });
  });

  describe("Events", function () {
      it("Should emit an event on public server creation", async function () {
          const { storageSharing, socket, maxStorage, owner } = await loadFixture(deployStorageSharingFixture);
          
          const price = ethers.utils.parseEther("0.01"); // 0.01 Ether in wei
          await expect(storageSharing.publicServer(socket, maxStorage, { value: price }))
              .to.emit(storageSharing, "PublicServerCreated")
              .withArgs(owner.address, socket, maxStorage, price, anyValue);
      });
  });
});
