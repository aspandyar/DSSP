const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const { hardhatUrl, contractAddress } = require('../config/env');

// Load ABI from JSON file generated by Hardhat
const contractABI = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, 'StorageSharing.json'), 'utf8'
)).abi;

const web3 = new Web3(hardhatUrl);  // Connect to the Hardhat node

const StorageSharing = new web3.eth.Contract(contractABI, contractAddress);

module.exports = {
    StorageSharing,
    web3
};
