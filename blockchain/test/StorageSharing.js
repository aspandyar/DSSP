const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("StorageSharing", function () {
  async function deployStorageSharingFixture() {
      const socket = "example.socket:1234";
      const priceInWeiPerByte = 1n;

      const [owner, otherAccount] = await ethers.getSigners();

      const StorageSharing = await ethers.getContractFactory("StorageSharing");
      const storageSharing = await StorageSharing.deploy(priceInWeiPerByte);

      // For debugging purposes, use npm run test -- --verbose
      console.log(storageSharing);

      return { storageSharing, socket, owner, otherAccount };
  }

  describe("Deployment", function () {
      it("Should deploy the StorageSharing contract successfully", async function () {
          const { storageSharing } = await loadFixture(deployStorageSharingFixture);

          expect(storageSharing.target).to.properAddress;
      });

      it("Should set the right owner", async function () {
          const { storageSharing, owner, socket } = await loadFixture(deployStorageSharingFixture);

          await storageSharing.publishServer(socket);
          expect((await storageSharing.servers(0))[0]).to.equal(owner.address);
      });
  });

  describe("Public Server Creation", function () {
      it("Should create a public server with correct parameters", async function () {
          const { storageSharing, socket, owner } = await loadFixture(deployStorageSharingFixture);

          const tx = await storageSharing.publishServer(socket);
          await expect(tx).to.emit(storageSharing, "ServerCreated").withArgs(0);

          const servers = await storageSharing.listServers();
          const server = await storageSharing.getServer(0);
          const [serverOwner, serverSocket] = server;

          await expect(servers).to.have.lengthOf(1);
          await expect(serverOwner).to.equal(owner.address).and.to.equal(servers[0][0]);
          await expect(serverSocket).to.equal(socket).and.to.equal(servers[0][1]);
      });

      it("Should revert if the socket is empty", async function () {
          const { storageSharing } = await loadFixture(deployStorageSharingFixture);

          await expect(storageSharing.publishServer("")).to.be.revertedWith("Socket is required");
      });
  });

  describe("File Storage Bought", function () {
      it("Should buy storage", async function() {
          const { storageSharing, socket, owner, otherAccount } = await loadFixture(deployStorageSharingFixture);
          const priceInWeiPerByte = 1n;

          const file = {
              id: 0,
              size: 1000n,
              name: "file.txt",
              serverIds: [0, 0],
              blockHashes: [0x12345, 0x67890],

              user: otherAccount.address,
          }

          await storageSharing.publishServer(socket);

          await storageSharing.buyStorage(Object.values(file), { value: 1000 });

          const fileMetadatas = await storageSharing.listFileMetadatas(otherAccount.address);
          const fileMetadata = await storageSharing.getFileMetadata(0);

          await expect(fileMetadatas).to.have.lengthOf(1);
          await expect(fileMetadata[0]).to.equal(fileMetadatas[0][0]);
      });
  });
});
