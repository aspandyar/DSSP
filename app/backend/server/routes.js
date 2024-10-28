const express = require('express');
const router = express.Router();
const { StorageSharing } = require('../blockchain/web3');
const multer = require("multer");
const crypto = require("crypto");

router.post('/public', async (req, res) => {
    const { socket, from } = req.body;

    try {
        const tx = await StorageSharing.methods.publishServer(socket).send({ from: from });
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

router.get('/file/:id', async (req, res) => {
    try {
        const file = await StorageSharing.methods.getFileMetadata(req.params.id).call();

        fileSerialized = {
            id: file.id.toString(),
            size: file.size.toString(),
            serverIds: file.serverIds.map(id => id.toString()),
            blockHashes: file.blockHashes.map(hash => hash.toString()),
            name: file.name,

            user: file.user
        };

        res.json({ fileSerialized });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/buyStorage', async (req, res) => {
    const { size, name, serverIds, blockHashes, id, from } = req.body;

    const fileMetadata = {
        id,
        size,
        name,
        serverIds,
        blockHashes,

        user: from
    };

    totalCost = size;

    try {
        const tx = await StorageSharing.methods.buyStorage(fileMetadata).send({ from: from, value: totalCost });
        res.json({ transactionHash: tx.transactionHash });
    } catch (error) {
        console.error("Error during buyStorage:", error);
        res.status(500).json({ error: error.message });
    }
});

const splitFile = (fileBuffer, blockLength) => {
    const blockCount = Math.ceil(fileBuffer.length / blockLength);
    return Array.from({ length: blockCount }, (_, i) => {
        return fileBuffer.slice(i * blockLength, (i + 1) * blockLength);
    });
}

router.post("/prepareFile", multer().single("file"), async (req, res) => {
    // Route to upload a file, split it into blocks, and calculate SHA-256 hash for each block

    const { buffer: fileBuffer } = req.file;
    const blockLength = 4096;

    const blockHashes = splitFile(fileBuffer, blockLength).map(block => {
        return crypto.createHash("sha256").update(block).digest("hex");
    });

    const servers = await StorageSharing.methods.listServers().call();
    // Randomly choose 3 servers and randomly distribute the block hashes
    // If servers is less than 3, distribute to all servers
    const serverIds = servers.map((_, i) => i).sort(() => 0.5 - Math.random()).slice(0, 3);

    res.json({
        blockHashes,
        serverIds: blockHashes.map(() => serverIds[Math.floor(Math.random() * serverIds.length)])
    });
});

router.post("/uploadFile", multer().fields([{ name: "file" }, { name: "data" }]), async (req, res) => {
    // Route to upload a file to runners
    // First get a runner list from blockchain
    let { file } = req.files;
    let { data } = req.body;

    const { buffer: fileBuffer } = file;
    const { blockHashes } = JSON.parse(data);

    const blockToSocket = {};
    for (const hash of blockHashes) {
        const numericHash = BigInt(parseInt(`0x${hash}`, 16));
        const serverId = (await StorageSharing.methods.fileMetadataIdByHash(numericHash).call());
        if (serverId === 0) {
            return res.status(403).send("Block metadata not authorized");
        }
        const server = await StorageSharing.methods.getServer(serverId - 1n).call();
        blockToSocket[hash] = server[1];r
    }

    return res.json({ blockToSocket });
});

module.exports = router;
