import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container } from 'react-bootstrap';
import CounterComponent from './ui/components/CounterComponent';

const App = () => {
    return (
        <Container>
            <h1>Hello, React Bootstrap!</h1>
            <CounterComponent />
        </Container>
    );
};

export default App;
