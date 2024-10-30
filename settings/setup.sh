#!/bin/bash

# Set the directories
BLOCKCHAIN_DIR="./blockchain"
BACKEND_DIR="./app/backend"
FRONTEND_DIR="./app/frontend"

# Install npm packages in each directory
echo "Installing npm packages..."
(cd $BLOCKCHAIN_DIR && npm install)
(cd $BACKEND_DIR && npm install)
(cd $FRONTEND_DIR && npm install)

# Deploy the smart contract and run a node
echo "Starting the local Ethereum node and deploying the contract..."
(cd $BLOCKCHAIN_DIR && npm run node &)
(cd $BLOCKCHAIN_DIR && npm run deploy)

# Wait for a few seconds to ensure the node is running
sleep 5

# Get the contract address (modify this according to your deployment output)
CONTRACT_ADDRESS=$(cat $BLOCKCHAIN_DIR/artifacts/contracts/StorageSharing.sol/StorageSharing.json | jq -r '.networks."5777".address')

# Create .env file in app/backend
echo "Creating .env file in $BACKEND_DIR..."
echo -e "HARDHAT_URL=http://127.0.0.1:8545\nPRIVATE_KEY=YOUR_PRIVATE_KEY\nCONTRACT_ADDRESS=$CONTRACT_ADDRESS" > $BACKEND_DIR/.env

# Start the backend and frontend
echo "Starting the backend and frontend servers..."
(cd $BACKEND_DIR && npm run start) &
(cd $FRONTEND_DIR && npm run start)

echo "Setup complete! Your app should now be running."
