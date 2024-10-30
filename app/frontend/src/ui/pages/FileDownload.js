import React, { useState, useEffect } from 'react';
import { Button, Card, Container, ListGroup } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { listServers, listFiles } from '../../blockchain/chainCalls';

const FileDownload = () => {
    const [fileList, setFileList] = useState([]);
    const [serverList, setServerList] = useState([]);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const storedAccount = Cookies.get('account');

            if (!storedAccount) {
                alert("Please log in using MetaMask.");
                setLoading(false);
                return;
            }

            setAccount(storedAccount);
            try {
                const servers = await listServers();
                console.log("Servers:", servers);
                setServerList(servers);

                const files = await listFiles(storedAccount, storedAccount);
                console.log("Files:", files);
                setFileList(files);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <Container className="text-center">
            <Card>
                <Card.Body>
                    <Card.Title>File Download</Card.Title>
                    {loading ? (
                        <p>Loading...</p>
                    ) : account ? (
                        <>
                            <h5>Your Account: {account}</h5>
                            <h6>Servers:</h6>
                            <ListGroup>
                                {serverList.length > 0 ? (
                                    serverList.map((server, index) => (
                                        <ListGroup.Item key={index}>{server}</ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>No servers found.</ListGroup.Item>
                                )}
                            </ListGroup>
                            <h6>Files:</h6>
                            <ListGroup>
                                {fileList.length > 0 ? (
                                    fileList.map((file, index) => (
                                        <ListGroup.Item key={index}>
                                            {file.name} (Size: {file.size} bytes)
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>No files found.</ListGroup.Item>
                                )}
                            </ListGroup>
                        </>
                    ) : (
                        <p>Please log in using MetaMask to access your account.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FileDownload;
