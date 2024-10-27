require("dotenv").config();

const { storageContract } = require("../config/web3");

const publicKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const publishServer = async (socket) => {
    await storageContract.methods.publishServer(socket).send({
        from: publicKey,
    });
};

async function main() {
    const socket = "http://127.0.0.1:3000";
    await publishServer(socket);
}

main().catch(console.error);