const { StorageSharing } = require('./web3');

async function publishServer(socket, fromAddress) {
    try {
        const tx = await StorageSharing.methods.publishServer(socket).send({ from: fromAddress });
        console.log("Transaction Hash:", tx.transactionHash);
        return tx.transactionHash;
    } catch (error) {
        console.error("Error publishing server:", error);
        throw error;
    }
}

async function listServers() {
    try {
        const servers = await StorageSharing.methods.listServers().call();
        console.log("Servers:", servers);
        return servers;
    } catch (error) {
        console.error("Error listing servers:", error);
        throw error;
    }
}

async function getServer(id) {
    try {
        const server = await StorageSharing.methods.getServer(id).call();
        console.log("Server:", server);
        return server;
    } catch (error) {
        console.error("Error getting server:", error);
        throw error;
    }
}

async function listFiles(userAddress, fromAddress) {
    try {
        const files = await StorageSharing.methods.listFileMetadatas(userAddress).call({ from: fromAddress });
        return files.map(file => ({
            id: file.id.toString(),
            size: file.size.toString(),
            serverIds: file.serverIds.map(id => id.toString()),
            blockHashes: file.blockHashes.map(hash => hash.toString()),
            name: file.name,
            user: file.user
        }));
    } catch (error) {
        console.error("Error listing files:", error);
        throw error;
    }
}

async function getFileMetadata(id) {
    try {
        const file = await StorageSharing.methods.getFileMetadata(id).call();
        return {
            id: file.id.toString(),
            size: file.size.toString(),
            serverIds: file.serverIds.map(id => id.toString()),
            blockHashes: file.blockHashes.map(hash => hash.toString()),
            name: file.name,
            user: file.user
        };
    } catch (error) {
        console.error("Error getting file metadata:", error);
        throw error;
    }
}

async function buyStorage(size, name, serverIds, blockHashes, id, fromAddress) {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install it to use this feature.');
    }

    try {
        const fileMetadata = {
            id: 0,
            size: size,
            name: name,
            serverIds: serverIds,
            blockHashes: blockHashes,
            user: fromAddress,
        };

        const pricePerByte = await StorageSharing.methods.priceInWeiPerByte().call();
        const totalCost = size * Number(pricePerByte);

        const confirmMessage = `You are about to pay ${totalCost / 1e18} ETH for storage. Do you want to proceed?`;
        const userConfirmed = window.confirm(confirmMessage);

        if (!userConfirmed) {
            console.log("Transaction cancelled by user.");
            return;
        }

        const tx = await StorageSharing.methods.buyStorage(fileMetadata).send({ 
            from: fromAddress, 
            value: totalCost 
        });
        return tx.transactionHash;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    publishServer,
    listServers,
    getServer,
    listFiles,
    getFileMetadata,
    buyStorage
};


module.exports = {
    publishServer,
    listServers,
    getServer,
    listFiles,
    getFileMetadata,
    buyStorage
};
