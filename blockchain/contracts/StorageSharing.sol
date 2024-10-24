// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract StorageSharing {
    constructor(uint _priceInWeiPerByte) {
        priceInWeiPerByte = _priceInWeiPerByte;
    }

    uint256 public priceInWeiPerByte;
    Server[] public servers;
    FileMetadata[] public fileMetadatas;

    struct Server {
        address payable owner;
        string socket;
    }

    struct FileMetadata {
        uint id;
        uint size;
        string name;
        uint[] serverIds;
        uint[] blockHashes;

        address user;
    }

    event ServerCreated(
        uint indexed id
    );

    function publishServer(string memory _socket) public {
        require(bytes(_socket).length > 0, "Socket is required");

        Server memory newServer = Server(
            payable(msg.sender),
            _socket
        );
        servers.push(newServer);

        console.log("Public server created by %s", msg.sender);

        emit ServerCreated(servers.length - 1);
    }

    function getServer(uint id) public view returns (Server memory) {
        return servers[id];
    }

    function listServers() public view returns (Server[] memory) {
        return servers;
    }

    function listFileMetadatas(address user) public view returns (FileMetadata[] memory) {
        FileMetadata[] memory userFileMetadatas = new FileMetadata[](fileMetadatas.length);
        uint userFileMetadatasCount = 0;

        for (uint i = 0; i < fileMetadatas.length; i++) {
            if (fileMetadatas[i].user == user) {
                userFileMetadatas[userFileMetadatasCount] = fileMetadatas[i];
                userFileMetadatasCount++;
            }
        }

        return userFileMetadatas;
    }

    function getFileMetadata(uint id) public view returns (FileMetadata memory) {
        return fileMetadatas[id];
    }

    function buyStorage(FileMetadata memory fileMetadata) payable public {
        uint totalCost = fileMetadata.size * priceInWeiPerByte;
        require(msg.value == totalCost, "Insufficient funds");

        // Pay for owner of each server
        for (uint i = 0; i < fileMetadata.serverIds.length; i++) {
            Server memory server = servers[fileMetadata.serverIds[i]];
            server.owner.transfer(totalCost / fileMetadata.serverIds.length);
        }

        fileMetadata.id = fileMetadatas.length;
        fileMetadatas.push(fileMetadata);
    }
}
