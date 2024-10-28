async function getEncryptionPublicKey() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return await window.ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]]
    });
}

async function encryptFile(file, encryptionPublicKey) {
    const base64Data = await fileToBase64(file);

    console.log(encryptionPublicKey);
    
    const encryptedData = encrypt({
        publicKey: encryptionPublicKey,
        data: base64Data,
        version: 'x25519-xsalsa20-poly1305'
    });

    const encryptedBlob = new Blob([JSON.stringify(encryptedData)], { type: file.type });
    return encryptedBlob;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function decryptFile(encryptedValue) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const decryptedData = await window.ethereum.request({
        method: 'eth_decrypt',
        params: [encryptedValue, accounts[0]]
    });

    return base64ToBlob(decryptedData, 'application/octet-stream');
}

function base64ToBlob(base64, type) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
}

// Main function to handle file encryption and upload
const uploadFile = async (file) => {
    try {
        const encryptionPublicKey = await getEncryptionPublicKey();
        const encryptedFile = await encryptFile(file, encryptionPublicKey);
        const formData = new FormData();
        formData.append('file', encryptedFile, file.name);

        const response = await fetch('http://192.168.1.29:8000/api/server/prepareFile', {
            method: 'POST',
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export { uploadFile };
