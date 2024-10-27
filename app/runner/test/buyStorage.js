require("dotenv").config();

const fs = require("fs");
const crypto = require("crypto");
const { storageContract } = require("../config/web3");

const publicKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const buyStorage = async (fileMetadata) => {

    const fileSize = fileMetadata.size;
    const pricePerByte = await storageContract.methods.priceInWeiPerByte().call();
    const totalCost = fileSize * pricePerByte;

    await storageContract.methods.buyStorage(fileMetadata).send({
        value: totalCost,
        from: publicKey,
    });
};

const readFileAndPrepareMetadata = async () => {
    const filePath = "test/testfile.txt";
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fileBuffer.length;
    const blockHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const fileMetadata = {
        id: 0n,
        size: BigInt(fileSize),
        name: "testfile.txt",
        serverIds: [0n],
        blockHashes: [BigInt(parseInt(blockHash, 16))],
        user: publicKey,
    };

    await buyStorage(fileMetadata);
};

readFileAndPrepareMetadata().catch(console.error);
