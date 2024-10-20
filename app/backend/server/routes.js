const express = require('express');
const router = express.Router();
const { StorageSharing } = require('../blockchain/web3');

// "Hello World" route with some backend logic
router.get('/hello', (req, res) => {
    try {
        // Simple backend logic
        res.json({ message: 'Hello, World!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route that interacts with the blockchain
router.post('/public', async (req, res) => {
    const { socket } = req.body;  // Extract the socket string from the request body

    if (!socket) {
        return res.status(400).json({ error: 'Socket is required' });
    }

    try {
        // Call the publishServer function with the provided socket
        const tx = await StorageSharing.methods.publishServer(socket).send({ from: req.body.from }); // Specify the sender's address
        res.json({ transactionHash: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
