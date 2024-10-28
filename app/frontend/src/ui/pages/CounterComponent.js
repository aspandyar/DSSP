import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { incrementCount, decrementCount, getCount } from '../../services/counterService';

const CounterComponent = () => {
    const [count, setCount] = useState(getCount());

    useEffect(() => {
        // Update the local count when the service count changes
        const handleCountChange = () => {
            setCount(getCount());
        };

        // This is a simulated subscription for state change
        const interval = setInterval(handleCountChange, 100);

        return () => clearInterval(interval);
    }, []);

    const handleIncrement = () => {
        setCount(incrementCount());
    };

    const handleDecrement = () => {
        setCount(decrementCount());
    };

    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>Counter: {count}</Card.Title>
                <Button variant="success" onClick={handleIncrement}>Increment</Button>
                <Button variant="danger" onClick={handleDecrement}>Decrement</Button>
            </Card.Body>
        </Card>
    );
};

export default CounterComponent;
