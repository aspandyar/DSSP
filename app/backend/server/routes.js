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
    const userAddress = req.body.user1;

    console.log(userAddress); 

    try {
        const files = await StorageSharing.methods.listFileMetadatas(userAddress).call({ from: req.body.from });
        res.json({ files });
    } catch (error) {
        console.log(error, userAddress);
        res.status(500).json({ error: error.message });
    }
});

router.post('/buyStorage', async (req, res) => {
    const { size, name, serverIds, blockHashes, id, user, value } = req.body;

    if (!size || !name || !serverIds || !blockHashes || !id || !user ) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const fileMetadata = {
        id,
        size,
        name,
        serverIds,
        blockHashes,
        value
    };

    totalCost = size;

    try {
        const tx = await StorageSharing.methods.buyStorage(Object.values(fileMetadata)).send({ from: user, value: totalCost });
        res.json({ transactionHash: tx.transactionHash });
    } catch (error) {
        console.error("Error during buyStorage:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
