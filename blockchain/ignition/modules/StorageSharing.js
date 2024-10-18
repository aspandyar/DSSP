// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat"); 

const DEFAULT_MAX_STORAGE = 1000;
const DEFAULT_SOCKER = "example.com:1234";

module.exports = buildModule("StorageSharingModule", (m) => {
  const max_storage = m.getParameter("maxStorage", DEFAULT_MAX_STORAGE);
  const socket = m.getParameter("socket", DEFAULT_SOCKER);
  const price = "0.01"; // hardcoded price

  const priceInWei = ethers.parseEther(price);

  const StorageSharingContract = m.contract(
    "StorageSharing",
    [], 
    {},
  );

  console.log(StorageSharingContract);
  const publicServerTx = StorageSharingContract.publicServer(socket, max_storage, { value: priceInWei });

  m.waitFor(publicServerTx);

  return { StorageSharingContract, publicServerTx }; // include the contract and transaction information 
});
