import CryptoJS from 'crypto-js';

export const encryptData = (data, privateKey) => {
    const wordArray = CryptoJS.lib.WordArray.create(data);
    const encryptedData = CryptoJS.AES.encrypt(wordArray, privateKey).toString();
    return encryptedData;
};

export const decryptData = (encryptedData, privateKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, privateKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8); 

    if (!decryptedData) {
        throw new Error("Decryption failed: No valid data returned.");
    }

    return decryptedData;
};
