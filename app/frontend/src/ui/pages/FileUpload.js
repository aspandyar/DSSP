import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Container, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { prepareFile, uploadFile } from '../../api/fileManipulations';
import { Web3Context } from '../../blockchain/web3';
import { encryptData } from '../../services/fileProtection';

const FileUpload = () => {
    const { buyStorage } = useContext(Web3Context); 
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [showError, setShowError] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const savedAccount = Cookies.get('account');
        if (savedAccount) {
            setAccount(savedAccount);
            setError(null);
        } else {
            setError("Error: User is not authenticated.");
        }
    }, []);

    const handleFileChange = (event) => {
        const fileRaw = event.target.files[0]; 
    
        if (!fileRaw) {
            setError("Error: No file selected.");
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = (loadEvent) => {
            try {
                const fileData = loadEvent.target.result;
                const encryptedFileData = encryptData(fileData, account);
                
                const encryptedBlob = new Blob([encryptedFileData], { type: 'application/octet-stream' });
                
                setFile({
                    name: fileRaw.name,
                    size: fileRaw.size,
                    blob: encryptedBlob,
                });
                setError(null);
            } catch (error) {
                console.log(error);
                setError("Error: Failed to encrypt file: " + error.message);
            }
        };
    
        reader.onerror = (error) => {
            console.log(error);
            setError("Error: Failed to read file: " + error.message);
        };
    
        reader.readAsArrayBuffer(fileRaw);
    };

    const handleUpload = async () => {
        if (!account) {
            setError("You are not authenticated!");
            setShowError(true); 
            return;
        }

        if (!file) {
            setError("File not selected or already uploaded!");
            setShowError(true); 
            return;
        }

        try {
            const result = await prepareFile(file.blob); // Pass the Blob instead of the raw data

            const chainResponse = await buyStorage(
                file.size,
                file.name,
                result.serverIds,
                result.blockHashes
            );

            await uploadFile(file.blob); // Upload the Blob

            setError(null);
            setShowError(false);
            setSuccessMessage(`File uploaded successfully! Storage Hash: ${chainResponse}`);
            setFile(null); 
        } catch (error) {
            setError(error.message);
            setShowError(true); 
            setSuccessMessage(null);
        }
    };

    return (
        <Container className="text-center">
            <Card>
                <Card.Body>
                    <Card.Title>File Upload</Card.Title>
                    {showError && error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="*/*" // Limit accepted file types
                    />
                    <Button variant="primary" onClick={handleUpload}>Upload File</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FileUpload;
