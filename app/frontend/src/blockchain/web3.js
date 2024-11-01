import React, { createContext, useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "./StorageSharing.json";

import Cookies from "js-cookie";

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          // const accounts = await window.ethereum.request({
          //   method: "eth_requestAccounts",
          // });
          // setAccount(accounts[0]);
          setAccount(Cookies.get("account"))


          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
          const contractInstance = new web3Instance.eth.Contract(
            contractABI.abi,
            contractAddress
          );
          setContract(contractInstance);

          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0] || null);
          });

          // window.ethereum.on('chainChanged', () => {
          //   window.location.reload();
          // });
        } catch (err) {
          throw new Error(`Error initializing Web3: ${err.message}`);
        }
      } else {
        throw new Error("No MetaMask found. Make sure it is installed.");
      }
    };

    initWeb3();
  }, []);

  const buyStorage = async (size, name, serverIds, blockHashes) => {
    console.log("account", account) 

    if (!contract || !account)
      throw new Error("Contract or account not initialized.");

    try {
      const pricePerByte = await contract.methods.priceInWeiPerByte().call();

      const totalCost = (BigInt(size) * BigInt(pricePerByte)).toString();

      const fileMetadata = {
        id: 0,
        size,
        name,
        serverIds,
        blockHashes,
        user: account,
      };

      const response = await contract.methods
        .buyStorage(fileMetadata)
        .send({ from: account, value: totalCost });

      

        console.log(response)

      return response.transactionHash;
    } catch (error) {
      console.error("Error buying storage:", error);
      throw error;
    }
  };

  const publishServer = async (socket) => {
    if (!contract || !account)
      throw new Error("Contract or account not initialized.");

    try {
      const tx = await contract.methods
        .publishServer(socket)
        .send({ from: account });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error publishing server:", error);
      throw error;
    }
  };

  const listServers = async () => {
    if (!contract) throw new Error("Contract not initialized.");

    try {
      const servers = await contract.methods.listServers().call();
      return servers;
    } catch (error) {
      console.error("Error listing servers:", error);
      throw error;
    }
  };

  const getServer = async (id) => {
    if (!contract) throw new Error("Contract not initialized.");

    try {
      const server = await contract.methods.getServer(id).call();
      return server;
    } catch (error) {
      console.error("Error getting server:", error);
      throw error;
    }
  };

  const listFiles = async (userAddress) => {
    if (!contract || !account)
      throw new Error("Contract or account not initialized.");

    try {
      const files = await contract.methods
        .listFileMetadatas(userAddress)
        .call({ from: account });
      return files.map((file) => ({
        id: file.id.toString(),
        size: file.size.toString(),
        serverIds: file.serverIds.map((id) => id.toString()),
        blockHashes: file.blockHashes.map((hash) => hash.toString()),
        name: file.name,
        user: file.user,
      }));
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  };

  const getFileMetadata = async (id) => {
    if (!contract) throw new Error("Contract not initialized.");

    try {
      const file = await contract.methods.getFileMetadata(id).call();
      return {
        id: file.id.toString(),
        size: file.size.toString(),
        serverIds: file.serverIds.map((id) => id.toString()),
        blockHashes: file.blockHashes.map((hash) => hash.toString()),
        name: file.name,
        user: file.user,
      };
    } catch (error) {
      console.error("Error getting file metadata:", error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        contract,
        buyStorage,
        publishServer,
        listServers,
        getServer,
        listFiles,
        getFileMetadata,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };
