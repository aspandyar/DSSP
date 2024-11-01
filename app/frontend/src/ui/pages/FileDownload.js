import React, { useState, useContext } from "react";
import { Button, Card, Container, ListGroup, Alert } from "react-bootstrap";
import Cookies from "js-cookie";
import { Web3Context } from "../../blockchain/web3";

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

      const files = await listFiles(account, account);
      setFileList(files);

      console.log("Servers:", servers);
      console.log("Files:", files);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
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
