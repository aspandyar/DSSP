const { Web3 } = require("web3");

const web3 = new Web3(process.env.WEB3_PROVIDER_URL);

const storageContractABI = [{
    "inputs": [{
        "internalType": "uint256", "name": "_priceInWeiPerByte", "type": "uint256",
    }], "stateMutability": "nonpayable", "type": "constructor",
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256",
    }], "name": "ServerCreated", "type": "event",
}, {
    "inputs": [{
        "components": [{
            "internalType": "uint256", "name": "id", "type": "uint256",
        }, {
            "internalType": "uint256", "name": "size", "type": "uint256",
        }, {
            "internalType": "string", "name": "name", "type": "string",
        }, {
            "internalType": "uint256[]", "name": "serverIds", "type": "uint256[]",
        }, {
            "internalType": "uint256[]", "name": "blockHashes", "type": "uint256[]",
        }, {
            "internalType": "address", "name": "user", "type": "address",
        }], "internalType": "struct StorageSharing.FileMetadata", "name": "fileMetadata", "type": "tuple",
    }], "name": "buyStorage", "outputs": [], "stateMutability": "payable", "type": "function",
}, {
    "inputs": [{
        "internalType": "uint256", "name": "", "type": "uint256",
    }], "name": "fileMetadataIdByHash", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [{
        "internalType": "uint256", "name": "", "type": "uint256",
    }], "name": "fileMetadatas", "outputs": [{
        "internalType": "uint256", "name": "id", "type": "uint256",
    }, {
        "internalType": "uint256", "name": "size", "type": "uint256",
    }, {
        "internalType": "string", "name": "name", "type": "string",
    }, {
        "internalType": "address", "name": "user", "type": "address",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [{
        "internalType": "uint256", "name": "id", "type": "uint256",
    }], "name": "getFileMetadata", "outputs": [{
        "components": [{
            "internalType": "uint256", "name": "id", "type": "uint256",
        }, {
            "internalType": "uint256", "name": "size", "type": "uint256",
        }, {
            "internalType": "string", "name": "name", "type": "string",
        }, {
            "internalType": "uint256[]", "name": "serverIds", "type": "uint256[]",
        }, {
            "internalType": "uint256[]", "name": "blockHashes", "type": "uint256[]",
        }, {
            "internalType": "address", "name": "user", "type": "address",
        }], "internalType": "struct StorageSharing.FileMetadata", "name": "", "type": "tuple",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [{
        "internalType": "uint256", "name": "id", "type": "uint256",
    }], "name": "getServer", "outputs": [{
        "components": [{
            "internalType": "address payable", "name": "owner", "type": "address",
        }, {
            "internalType": "string", "name": "socket", "type": "string",
        }], "internalType": "struct StorageSharing.Server", "name": "", "type": "tuple",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [{
        "internalType": "address", "name": "user", "type": "address",
    }], "name": "listFileMetadatas", "outputs": [{
        "components": [{
            "internalType": "uint256", "name": "id", "type": "uint256",
        }, {
            "internalType": "uint256", "name": "size", "type": "uint256",
        }, {
            "internalType": "string", "name": "name", "type": "string",
        }, {
            "internalType": "uint256[]", "name": "serverIds", "type": "uint256[]",
        }, {
            "internalType": "uint256[]", "name": "blockHashes", "type": "uint256[]",
        }, {
            "internalType": "address", "name": "user", "type": "address",
        }], "internalType": "struct StorageSharing.FileMetadata[]", "name": "", "type": "tuple[]",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [], "name": "listServers", "outputs": [{
        "components": [{
            "internalType": "address payable", "name": "owner", "type": "address",
        }, {
            "internalType": "string", "name": "socket", "type": "string",
        }], "internalType": "struct StorageSharing.Server[]", "name": "", "type": "tuple[]",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [], "name": "priceInWeiPerByte", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256",
    }], "stateMutability": "view", "type": "function",
}, {
    "inputs": [{
        "internalType": "string", "name": "_socket", "type": "string",
    }], "name": "publishServer", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
    "inputs": [{
        "internalType": "uint256", "name": "", "type": "uint256",
    }], "name": "servers", "outputs": [{
        "internalType": "address payable", "name": "owner", "type": "address",
    }, {
        "internalType": "string", "name": "socket", "type": "string",
    }], "stateMutability": "view", "type": "function",
}];
const storageContract = new web3.eth.Contract(storageContractABI, process.env.STORAGE_CONTRACT_ADDRESS);

module.exports = { web3, storageContract };
