const express = require('express');
const router = express.Router();
const { StorageSharing } = require('../blockchain/web3');

// "Hello World" route with some backend logic
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
        const servers = await StorageSharing.methods.listServers({ from: req.body.from }).call();
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

module.exports = router;
