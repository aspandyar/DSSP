import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
      <>
        <div className="flex-grow-1"></div>
        <footer className="bg-dark text-light py-4">
            <Container className="text-center">
                <Row>
                    <Col>
                        <p>© 2024 Decentralized Storage Sharing Platform. All rights reserved.</p>
                        <p>MIT License</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Contact Us: <a href="mailto:aspandyart@gmail.com" className="text-light">aspandyart@gmail.com</a></p>
                    </Col>
                    <Col>
                        <p>
                            <a 
                                href="https://github.com/your-github-username" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-light"
                            >
                                GitHub Repository
                            </a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
      </>
    );
};

export default Footer;
