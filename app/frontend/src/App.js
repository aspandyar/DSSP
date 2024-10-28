import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './ui/components/Header';
import Footer from './ui/components/Footer';
import { Container } from 'react-bootstrap';
import CounterComponent from './ui/pages/CounterComponent';
import FileUploadComponent from './ui/pages/FileUploadComponent';
import Home from './ui/pages/Home';

const App = () => {
    return (
        <Router>
            <Header />
            <Container className="py-5">
                <Routes>
                    <Route path="/counter" element={<CounterComponent />} />
                    <Route path="/file-upload" element={<FileUploadComponent />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Container>
            <Footer />
        </Router>
    );
};

export default App;
