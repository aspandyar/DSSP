// web3.js
import Web3 from 'web3';
import contractABI from './StorageSharing.json'; // Adjust the path as necessary

// const hardhatUrl = process.env.HARDHAT_URL;
// const contractAddress = process.env.CONTRACT_ADDRESS;


const hardhatUrl = process.env.REACT_APP_HARDHAT_URL;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const web3 = new Web3(hardhatUrl);

const StorageSharing = new web3.eth.Contract(contractABI.abi, contractAddress);

export { StorageSharing, web3 };
