#!/bin/bash

npm run node &

sleep 5

npm run deploy

sleep 5
mv "./artifacts/contracts/StorageSharing.sol/StorageSharing.json" "../app/backend/blockchain/StorageSharing.json"

CONTRACT_ADDRESS=$(grep -Po '"address": *"\K[^"]*' "../app/backend/blockchain/StorageSharing.json")

sed -i "s/^CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" "../app/backend/.env"

echo "Deployment completed successfully. Contract address: $CONTRACT_ADDRESS"
