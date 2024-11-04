require("dotenv").config();

const fs = require("fs");
const { storageContract } = require("../config/web3");

const publicKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // user account

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
    const fileSize = BigInt(fileBuffer.length);

    const blockHashes = [
        "0x86fa6026bed5f0cab1c6fadfe4543100be040f91d607d9277fc36ecca2e826b1",
        "0x825640d4fb98a1d561e6004159efc7650a0ad7c0218a472b8525f3788146d551",
        "0x9e1fb3e748c49ffe00b1371a7b4f84058afd49f8643f930423e342e7c20222b9",
        "0xd3cb5f7910296f096f6a431a511e519a075b91ab7c558de139acceab67391fa7",
    ].map((hash) => BigInt(hash));
    const serverIds = [
        0,
        0,
        0,
        0,
    ];

    const fileMetadata = {
        id: 0n,
        size: fileSize,
        name: "testfile.txt",
        serverIds: serverIds,
        blockHashes: blockHashes,
        user: publicKey,
    };

    await buyStorage(fileMetadata);
};

readFileAndPrepareMetadata().catch(console.error);
