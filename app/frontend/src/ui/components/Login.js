import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

const LoginComponent = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const savedAccount = Cookies.get('account');
        if (savedAccount) {
            setAccount(savedAccount);
        }
    }, []);

    const handleLogin = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const currentAccount = accounts[0];

                setAccount(currentAccount);
                Cookies.set('account', currentAccount, { expires: 7 });

                window.location.reload();
            } catch (error) {
                console.error("User denied account access:", error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this app.');
        }
    };

    const handleLogout = () => {
        setAccount(null);
        Cookies.remove('account');
        window.location.reload(); 
    };

    return (
        <div>
            {account ? (
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            ) : (
                <Button variant="primary" onClick={handleLogin}>
                    Connect MetaMask
                </Button>
            )}
        </div>
    );
};

export default LoginComponent;
