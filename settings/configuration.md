# Configuration Settings

### 1. Install Dependencies

Open your terminal and navigate to each directory, installing the necessary Node.js packages with npm.

```bash
cd /blockchain
npm install

cd ../app/backend
npm install

cd ../frontend
npm install
```

### 2. Deploy the Smart Contract and Run a Node

In the blockchain directory, run the commands to start the local Ethereum node and deploy your smart contract.

```bash
cd /blockchain

npm run node

npm run deploy
```

### 3. Obtain the Contract Information

After the contract is deployed, you need to locate the contract's ABI and address.

- **Find the ABI**: Navigate to the following directory to find the `StorageSharing.json` file:

```bash
cd artifacts/contracts/StorageSharing.sol
```

- **Copy the ABI and Address**: Open `StorageSharing.json` and note the contract address (usually in the `network` section) and the ABI (found in the `abi` section).

### 4. Create the .env File in the Backend

Next, you’ll need to create a `.env` file in the `app/backend` directory to store your environment variables.

```bash
cd ../../backend

touch .env
```

- **Edit the .env File**: Open the `.env` file in your preferred text editor and add the following configurations, replacing the placeholder values with actual data:

```
HARDHAT_URL=http://127.0.0.1:8545
PRIVATE_KEY=YOUR_PRIVATE_KEY
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
```

### 5. Start the Backend and Frontend

Now that your backend is configured, you can start both the backend and frontend applications.

```bash
cd ../backend
npm run start

cd ../frontend
npm run start
```

### Summary

Follow these steps sequentially to ensure everything is set up correctly. After completing these steps, your app should be up and running, with the smart contract deployed and the backend and frontend servers operational. If you encounter any issues, check the logs for error messages and verify each configuration step.
