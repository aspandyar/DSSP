const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Function to download a fragment from the server
async function downloadFragment(fragmentId) {
    const url = `http://localhost:3001/uploads/fragment_${fragmentId}.enc`;
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
}

function mergeFragments(fragmentPaths, outputFilePath) {
    const writeStream = fs.createWriteStream(outputFilePath);
    let readCount = 0; // Track the number of read streams
    let hasErrorOccurred = false; // Flag to track errors

    fragmentPaths.forEach(fragmentPath => {
        const readStream = fs.createReadStream(fragmentPath);

        // Pipe the read stream to the write stream
        readStream.pipe(writeStream, { end: false });

        readStream.on('end', () => {
            readCount++;
            // End the write stream only after all fragments are read
            if (readCount === fragmentPaths.length && !hasErrorOccurred) {
                writeStream.end();
            }
        });

        readStream.on('error', (err) => {
            hasErrorOccurred = true; // Set error flag
            console.error(`Error reading fragment ${fragmentPath}:`, err);
            // Cleanup by destroying the write stream if an error occurs
            writeStream.end(); // End the write stream on error
        });
    });

    // Handle write stream errors
    writeStream.on('error', (err) => {
        console.error(`Error writing to output file ${outputFilePath}:`, err);
        hasErrorOccurred = true; // Set error flag
    });

    // Ensure we handle the finish event of the write stream
    writeStream.on('finish', () => {
        console.log(`Successfully merged fragments into: ${outputFilePath}`);
    });
}


function decryptFile(encryptedFilePath, key) {
    console.log("Decrypting file...");

    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(encryptedFilePath);
        const output = fs.createWriteStream(encryptedFilePath.replace('.enc', ''));

        const iv = Buffer.alloc(16);

        input.on('error', (err) => {
            console.error('Input stream error:', err);
            reject(err);
        });

        output.on('error', (err) => {
            console.error('Output stream error:', err);
            reject(err);
        });

        input.once('data', (chunk) => {
            if (chunk.length < 16) {
                return reject(new Error('Input data is too short to read the IV.'));
            }

            chunk.copy(iv, 0, 0, 16);

            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

            decipher.on('error', (err) => {
                console.error('Decipher error:', err);
                reject(err);
            });
            input.pipe(decipher).pipe(output);
        });

        output.on('finish', () => resolve(output.path));
        console.log("File decrypted successfully!");
    });
}



// Main decryption process
async function decryptAndRestoreFile(fragmentCount) {
    const key = 'my_secret_key_123456789012345678'; // Same key used for encryption
    const fragmentPaths = [];

    // Download all fragments
    for (let i = 0; i < fragmentCount; i++) {
        const fragmentStream = await downloadFragment(i);
        const fragmentPath = path.join(__dirname, 'uploads', `fragment_${i}.enc`);
        const writeStream = fs.createWriteStream(fragmentPath);
        fragmentStream.pipe(writeStream);
        
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fragmentPaths.push(fragmentPath);
    }

    const mergedFilePath = path.join(__dirname, 'uploads', 'merged.enc');
    mergeFragments(fragmentPaths, mergedFilePath);
    console.log(`Merged fragments into: ${mergedFilePath}`);

    await decryptFile(mergedFilePath, key);
    console.log(`File decrypted successfully to: ${mergedFilePath.replace('.enc', '')}`);
}

const fragmentCount = 1;
decryptAndRestoreFile(fragmentCount)
    .then(() => console.log('Decryption process completed!'))
    .catch(err => console.error('Error during decryption:', err));
