import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import contractABI from './StorageSharing.json';

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

  const buyStorage = async (size, name, serverIds, blockHashes) => {
    if (!contract || !account) {
      throw new Error("Contract or account not initialized.");
    }

    try {
      const pricePerByte = await contract.methods.priceInWeiPerByte().call();
      const totalCost = size * Number(pricePerByte); 

      const fileMetadata = {
        id: 0,
        size,
        name,
        serverIds,
        blockHashes,
        user: account,
      };

      
      const gasLimit = await contract.methods.buyStorage(fileMetadata).estimateGas({
        from: account,
        value: totalCost.toString(), 
      });

      
      const gasPrice = await web3.eth.getGasPrice();

      const transactionParams = {
        to: contract.options.address,
        from: account,
        value: totalCost.toString(),
        data: contract.methods.buyStorage(fileMetadata).encodeABI(),
        gas: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
      };

      console.log("Transaction Params:", transactionParams);

      const receipt = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams],
      });

      return receipt;
    } catch (error) {
      console.error("Error buying storage:", error);
      setError(`Error buying storage: ${error.message}`);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{ web3, account, contract, buyStorage, error }}>
      {children}
      {error && <div className="error-message">{error}</div>}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };
