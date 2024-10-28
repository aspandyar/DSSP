import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const Home = () => {
    return (
        <div className="bg-light">
            <Container className="py-5 text-center mb-5">
                <h1 className="display-4">Welcome to the Decentralized Storage Sharing Platform</h1>
                <p className="lead">Secure, cost-effective, and censorship-resistant storage options for everyone.</p>
                <Button variant="primary" size="lg">Get Started</Button>
            </Container>

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2 className='mx-2'>Motivation</h2>
                        <ListGroup>
                            <ListGroup.Item>Reduce costs associated with centralized cloud storage services.</ListGroup.Item>
                            <ListGroup.Item>Promote resource sharing by utilizing underutilized storage space.</ListGroup.Item>
                            <ListGroup.Item>Provide a decentralized, secure, and censorship-resistant storage option.</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <h2 className='mx-2'>Core Features</h2>
                        <Row>
                            <Col md={4}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Peer-to-Peer Storage Marketplace</Card.Title>
                                        <Card.Text>
                                            Rent out your unused storage space or purchase storage from others on a decentralized network.
                                        </Card.Text>
                                        <Button variant="primary">Learn More</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Smart Contracts</Card.Title>
                                        <Card.Text>
                                            Automate agreements between storage providers and consumers, ensuring fair payments.
                                        </Card.Text>
                                        <Button variant="primary">Learn More</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>File Encryption</Card.Title>
                                        <Card.Text>
                                            Files are encrypted, fragmented, and stored across multiple nodes for security and redundancy.
                                        </Card.Text>
                                        <Button variant="primary">Learn More</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <h2 className='mx-2'>Additional Features</h2>
                        <ListGroup>
                            <ListGroup.Item>Automated Backup & Redundancy</ListGroup.Item>
                            <ListGroup.Item>Version Control</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <h2 className='mx-2'>About the Platform</h2>
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    A decentralized storage sharing platform that enables users to rent, share, and store data securely while benefiting from a peer-to-peer network.
                                </Card.Text>
                                <Button variant="success">Get Started</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <h2 className='mx-2'>Examples of Centralized Products</h2>
                        <ListGroup>
                            <ListGroup.Item>Google Drive</ListGroup.Item>
                            <ListGroup.Item>Dropbox</ListGroup.Item>
                            <ListGroup.Item>Amazon S3</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default Home;
