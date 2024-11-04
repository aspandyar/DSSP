import React, { useState, useContext } from "react";
import { Button, Card, Container, ListGroup, Alert, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import { Web3Context } from "../../blockchain/web3";
import { downloadFile } from '../../api/fileManipulations';

const FileDownload = () => {
  const { listServers, listFiles } = useContext(Web3Context);
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
      const files = await listFiles(account);

      const filesWithOwners = files.map((file) => {
        const owners = servers.filter((server) => file.user === server.owner).map((server) => server.owner);
        return { ...file, owners };
      });

      setFileList(filesWithOwners);
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
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h3" className="mb-3">File Download</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button variant="primary" onClick={handleFetchData} disabled={loading}>
            {loading ? "Loading..." : "Fetch Data"}
          </Button>
        </Card.Body>
      </Card>

      <Row xs={1} md={2} lg={3} className="g-4">
        {fileList.length > 0 ? (
          fileList.map((file) => (
            <Col key={file.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title as="h5">{file.name}</Card.Title>
                  <Card.Text>
                    <strong>Size:</strong> {file.size} bytes
                  </Card.Text>
                  <Card.Text>
                    <strong>Owners:</strong> {file.owners.join(", ")}
                  </Card.Text>
                  <Button variant="success" onClick={() => handleDownload(file)} className="mt-2">
                    Download
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">Click button to get files.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FileDownload;
