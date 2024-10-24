const express = require('express');
const router = express.Router();
const { StorageSharing } = require('../blockchain/web3');

router.get('/hello', (req, res) => {
    try {
        res.json({ message: 'Hello, World!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/public', async (req, res) => {
    const { socket } = req.body;

    if (!socket) {
        return res.status(400).json({ error: 'Socket is required' });
    }

    try {
        const tx = await StorageSharing.methods.publishServer(socket).send({ from: req.body.from });
        res.json({ transactionHash: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        const servers = await StorageSharing.methods.listServers().call();
        res.json({ servers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const server = await StorageSharing.methods.getServer(req.params.id).call();
        res.json({ server });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/listFiles', async (req, res) => {
    const userAddress = req.body.user;
    const fromAddress = req.body.from;

    console.log("User Address:", userAddress); 
    console.log("From Address:", fromAddress); 

    try {
        const files = await StorageSharing.methods.listFileMetadatas(userAddress).call({ from: fromAddress });
        const filesResponse = files.map(file => ({
            id: file.id.toString(),
            size: file.size.toString(),
            serverIds: file.serverIds.map(id => id.toString()),
            blockHashes: file.blockHashes.map(hash => hash.toString()),
            name: file.name, 
            user: file.user
        }));
        res.json({ filesResponse });
    } catch (error) {
        console.log(error, userAddress);
        res.status(500).json({ error: error.message });
    }
});

router.post('/buyStorage', async (req, res) => {
    const { size, name, serverIds, blockHashes, id, user } = req.body;

    if (!size || !name || !serverIds || !blockHashes ) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const fileMetadata = {
        id,
        size,
        name,
        serverIds,
        blockHashes,
        user
    };

    totalCost = size;

    try {
        const tx = await StorageSharing.methods.buyStorage(fileMetadata).send({ from: user, value: totalCost });
        res.json({ transactionHash: tx.transactionHash });
    } catch (error) {
        console.error("Error during buyStorage:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
