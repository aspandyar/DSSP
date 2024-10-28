import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './ui/components/Header';
import Footer from './ui/components/Footer';
import { Container } from 'react-bootstrap';
import CounterComponent from './ui/pages/Counter';
import FileUpload from './ui/pages/FileUpload';
import Home from './ui/pages/Home';
import FileDownload from './ui/pages/FileDownload';

const App = () => {
    return (
       <div className="d-flex flex-column min-vh-100">
        <Router>
            <Header />
            <Container className="py-5">
                <Routes>
                    <Route path="/counter" element={<CounterComponent />} />
                    <Route path="/file-upload" element={<FileUpload />} />
                    <Route path="/file-download" element={<FileDownload />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Container>
            <Footer />
        </Router>
      </div>
    );
};

export default App;
