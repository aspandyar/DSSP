const { web3 } = require('../blockchain/web3');

const sendSignedTransaction = async (txData, privateKey) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    try {
        const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt;
    } catch (error) {
        throw new Error(`Transaction failed: ${error.message}`);
    }
};

module.exports = {
    sendSignedTransaction
};
