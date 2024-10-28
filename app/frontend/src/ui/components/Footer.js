import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4">
            <Container className="text-center">
                <p>© 2024 Decentralized Storage Sharing Platform. All rights reserved.</p>
                <p>MIT License</p>
            </Container>
        </footer>
    );
};

export default Footer;
