  export const buyStorage = async (contract, account, size, name, serverIds, blockHashes) => {
    if (!contract || !account) throw new Error("Contract or account not initialized.");
  
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
  
      const response = await contract.methods.buyStorage(fileMetadata, totalCost).send({ from: account, value: totalCost });
      return response.transactionHash;
    } catch (error) {
      console.error("Error buying storage:", error);
      throw error;
    }
  };
  
  export const publishServer = async (contract, account, socket) => {
    if (!contract || !account) throw new Error("Contract or account not initialized.");
  
    try {
      const tx = await contract.methods.publishServer(socket).send({ from: account });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error publishing server:", error);
      throw error;
    }
  };
  
  export const listServers = async (contract) => {
    if (!contract) throw new Error("Contract not initialized.");
  
    try {
      const servers = await contract.methods.listServers().call();
      return servers;
    } catch (error) {
      console.error("Error listing servers:", error);
      throw error;
    }
  };
  
  export const getServer = async (contract, id) => {
    if (!contract) throw new Error("Contract not initialized.");
  
    try {
      const server = await contract.methods.getServer(id).call();
      return server;
    } catch (error) {
      console.error("Error getting server:", error);
      throw error;
    }
  };
  
  export const listFiles = async (contract, account, userAddress) => {
    if (!contract || !account) throw new Error("Contract or account not initialized.");
  
    try {
      const files = await contract.methods.listFileMetadatas(userAddress).call({ from: account });
      return files.map(file => ({
        id: file.id.toString(),
        size: file.size.toString(),
        serverIds: file.serverIds.map(id => id.toString()),
        blockHashes: file.blockHashes.map(hash => hash.toString()),
        name: file.name,
        user: file.user
      }));
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  };
  
  export const getFileMetadata = async (contract, id) => {
    if (!contract) throw new Error("Contract not initialized.");
  
    try {
      const file = await contract.methods.getFileMetadata(id).call();
      return {
        id: file.id.toString(),
        size: file.size.toString(),
        serverIds: file.serverIds.map(id => id.toString()),
        blockHashes: file.blockHashes.map(hash => hash.toString()),
        name: file.name,
        user: file.user
      };
    } catch (error) {
      console.error("Error getting file metadata:", error);
      throw error;
    }
  };
  