import React, { useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { uploadFile } from '../../api/fileManipulations';

const FileUploadComponent = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            const result = await uploadFile(file);
            console.log(result);
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    return (
        <Container className="text-center">
            <Card>
                <Card.Body>
                    <Card.Title>File Upload</Card.Title>
                    <input type="file" onChange={handleFileChange} />
                    <Button variant="primary" onClick={handleUpload}>Upload File</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FileUploadComponent;
