const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Function to encrypt the file
function encryptFile(filePath, key) {
    return new Promise((resolve, reject) => {
        if (key.length !== 32) {
            reject(new Error(`Key length must be 32 bytes for AES-256. Provided length: ${key.length}`));
            return;
        }
        
        const iv = crypto.randomBytes(16); // Use a random initialization vector
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(`${filePath}.enc`);

        output.write(iv); // Write the IV at the beginning of the file
        input.pipe(cipher).pipe(output);

        output.on('finish', () => resolve(`${filePath}.enc`));
        output.on('error', reject);
    });
}

// Function to split the file into chunks
function splitFile(filePath, chunkSize) {
    const fileData = fs.readFileSync(filePath);
    const totalSize = fileData.length;
    const chunks = [];

    for (let i = 0; i < totalSize; i += chunkSize) {
        const chunk = fileData.slice(i, i + chunkSize);
        const chunkPath = `${filePath}_part_${i}.enc`;
        fs.writeFileSync(chunkPath, chunk);
        chunks.push(chunkPath);
    }

    return chunks;
}

// Function to upload a fragment to the server
async function uploadFragment(fragmentPath, fragmentId) {
    const formData = new FormData();
    formData.append('fragment', fs.createReadStream(fragmentPath));
    formData.append('id', fragmentId.toString());

    const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: formData.getHeaders(),
    });

    return response.status;
}

// Main process: encrypting, splitting, and sending the file
async function processAndSendFile(filePath) {
    const key = 'my_secret_key_123456789012345678'; // Ensure this key is 32 bytes
    const encryptedFilePath = await encryptFile(filePath, key); // Encrypt the file

    const fragments = splitFile(encryptedFilePath, 1024 * 1024); // Split into 1 MB chunks

    // Upload fragments to the server
    for (let i = 0; i < fragments.length; i++) {
        await uploadFragment(fragments[i], i);
        console.log(`Fragment ${i} uploaded.`);
    }
}

// Test sending a file
const filePath = './test/test.txt'; // Path to your test file
processAndSendFile(filePath)
    .then(() => console.log('File sent successfully!'))
    .catch(err => console.error('Error sending file:', err));
