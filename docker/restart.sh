#!/bin/bash

docker stop file-storage-server-container 
docker rm file-storage-server-container 
docker build -t file-storage-server .
docker run -d -p 3001:3001 --name file-storage-server-container file-storage-server