// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StorageSharingModule", (m) => {
  const priceInWeiPerByte = m.getParameter("priceInWeiPerByte", 1n);
  const StorageSharingContract = m.contract(
    "StorageSharing",
    [priceInWeiPerByte],
    {},
  );

  //console.log(StorageSharingContract);

  return { StorageSharingContract };
});
