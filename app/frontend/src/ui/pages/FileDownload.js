import React, { useState, useContext } from "react";
import { Button, Card, Container, ListGroup, Alert } from "react-bootstrap";
import Cookies from "js-cookie";
import { Web3Context } from "../../blockchain/web3";
import { downloadFile } from '../../api/fileManipulations';

const FileDownload = () => {
  const { listServers, listFiles } = useContext(Web3Context);
  const [serverList, setServerList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [account, setAccount] = useState(Cookies.get("account") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    if (!account) {
      setError("Error: User is not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const servers = await listServers();
      setServerList(servers);

      const files = await listFiles(account);
      setFileList(files);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      await downloadFile(file.id, file.name);
    } catch (error) {
      setError("Failed to download file. Please try again.");
    }
  };

  return (
    <Container className="text-center">
      <Card>
        <Card.Body>
          <Card.Title>File Download</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button variant="primary" onClick={handleFetchData} disabled={loading}>
            {loading ? "Loading..." : "Fetch Data"}
          </Button>

          {account ? (
            <>
              <h5>Your Account: {account}</h5>

              <h6>Servers:</h6>
              <ListGroup>
                {serverList.length > 0 ? (
                  serverList.map((server, index) => (
                    <ListGroup.Item key={index}>
                      Server {index + 1}: {server.socket} (Owner: {server.owner})
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No servers found.</ListGroup.Item>
                )}
              </ListGroup>

              <h6>Files:</h6>
              <ListGroup>
                {fileList.length > 0 ? (
                  fileList.map((file) => (
                    <ListGroup.Item key={file.id}>
                      <div>
                        <strong>{file.name}</strong> (Size: {file.size} bytes)
                      </div>
                      <div>Servers: {file.serverIds.join(", ")}</div>
                      <div>Block Hashes: {file.blockHashes.join(", ")}</div>
                      <Button
                        variant="success"
                        onClick={() => handleDownload(file)}
                        className="mt-2"
                      >
                        Download
                      </Button>
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
