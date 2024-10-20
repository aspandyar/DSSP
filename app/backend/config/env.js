require('dotenv').config();

module.exports = {
    hardhatUrl: process.env.HARDHAT_URL,
    privateKey: process.env.PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
};
