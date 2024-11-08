require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  ignition: {
    modules: ["./ignition/modules/StorageSharing.js"], // Point to your modules here
},
};
