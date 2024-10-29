require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");

const { storageContract } = require("./config/web3");

const app = express();
const upload = multer();
app.use(express.json());

const status = (req, res) => res.send("OK");

const uploadBlock = async (req, res) => {
    const block = req.file.buffer.toString();
    if (!block) return res.status(400).send("Block data required");

    const blockHash = "0x" + crypto.createHash("sha256").update(block).digest("hex");
    const metadataExists = await checkMetadataExists(BigInt(blockHash));

    if (metadataExists) {
        const blockPath = `${process.env.BLOCKS_DIR}/${blockHash}`;
        fs.writeFileSync(blockPath, block);
        res.send({ blockHash });
    } else {
        res.status(403).send("Block metadata not authorized");
    }
};

const downloadBlock = (req, res) => {
    const { hash } = req.params;
    const blockPath = `${process.env.BLOCKS_DIR}/${hash}`;

    if (fs.existsSync(blockPath)) {
        res.sendFile(blockPath, { root: "." });
    } else {
        res.status(404).send("Block not found");
    }
};

const checkMetadataExists = async (blockHash) => {
    console.log("Checking metadata for block hash:", blockHash, blockHash.toString(16));
    const socket = await storageContract.methods.hashToSocket(blockHash).call();
    return socket !== "";
};

app.get("/status", status);
app.post("/uploadBlock", upload.single("block"), uploadBlock);
app.get("/downloadBlock/:hash", downloadBlock);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
