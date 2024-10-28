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

    const blockHashes = [
        "86fa6026bed5f0cab1c6fadfe4543100be040f91d607d9277fc36ecca2e826b1",
        "825640d4fb98a1d561e6004159efc7650a0ad7c0218a472b8525f3788146d551",
        "9e1fb3e748c49ffe00b1371a7b4f84058afd49f8643f930423e342e7c20222b9",
        "d3cb5f7910296f096f6a431a511e519a075b91ab7c558de139acceab67391fa7",
    ];

    const fileMetadata = {
        id: 0n,
        size: BigInt(fileSize),
        name: "testfile.txt",
        serverIds: [0n],
        blockHashes: blockHashes.map((hash) => BigInt(parseInt(hash, 16))),
        user: publicKey,
    };

    await buyStorage(fileMetadata);
};

readFileAndPrepareMetadata().catch(console.error);
