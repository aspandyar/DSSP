const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

const web3 = new Web3(process.env.WEB3_PROVIDER_URL);

const storageContractABI = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "StorageSharing.json"), "utf8",
)).abi;

const storageContract = new web3.eth.Contract(storageContractABI, process.env.STORAGE_CONTRACT_ADDRESS);

module.exports = { web3, storageContract };
