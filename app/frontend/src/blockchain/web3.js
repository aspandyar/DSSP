import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import contractABI from './StorageSharing.json';
import * as chainCalls from './chainCalls';

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
          const contractInstance = new web3Instance.eth.Contract(contractABI.abi, contractAddress);
          setContract(contractInstance);

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || null);
          });

          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (err) {
          setError(`Error initializing Web3: ${err.message}`);
        }
      } else {
        setError('No MetaMask found. Make sure it is installed.');
      }
    };

    initWeb3();
  }, []);

  const handleBuyStorage = async (size, name, serverIds, blockHashes) => {
    try {
      return await chainCalls.buyStorage(contract, account, size, name, serverIds, blockHashes);
    } catch (error) {
      setError(`Error buying storage: ${error.message}`);
      throw error;
    }
  };

  const handlePublishServer = async (socket) => {
    try {
      return await chainCalls.publishServer(contract, account, socket);
    } catch (error) {
      setError(`Error publishing server: ${error.message}`);
      throw error;
    }
  };

  const handleListServers = async () => {
    try {
      return await chainCalls.listServers(contract);
    } catch (error) {
      setError(`Error listing servers: ${error.message}`);
      throw error;
    }
  };

  const handleGetServer = async (id) => {
    try {
      return await chainCalls.getServer(contract, id);
    } catch (error) {
      setError(`Error getting server: ${error.message}`);
      throw error;
    }
  };

  const handleListFiles = async (userAddress) => {
    try {
      return await chainCalls.listFiles(contract, account, userAddress);
    } catch (error) {
      setError(`Error listing files: ${error.message}`);
      throw error;
    }
  };

  const handleGetFileMetadata = async (id) => {
    try {
      return await chainCalls.getFileMetadata(contract, id);
    } catch (error) {
      setError(`Error getting file metadata: ${error.message}`);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{ 
      web3, 
      account, 
      contract, 
      buyStorage: handleBuyStorage, 
      publishServer: handlePublishServer, 
      listServers: handleListServers, 
      getServer: handleGetServer, 
      listFiles: handleListFiles, 
      getFileMetadata: handleGetFileMetadata, 
      error 
    }}>
      {children}
      {error && <div className="error-message">{error}</div>}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };
