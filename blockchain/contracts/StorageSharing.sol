// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract StorageSharing {
    struct Server {
        address payable owner;
        address payable client;
        uint256 maxStorage;
        string socket;
        uint256 price; // Price to public server (in wei)
    }

    event PublicServerCreated(
        address indexed owner,
        string socket,
        uint256 maxStorage,
        uint256 price,
        uint256 timestamp
    );

    Server[] public servers;

    function publicServer(string memory _socket, uint256 _maxStorage) public payable {
        require(bytes(_socket).length > 0, "Socket is required");
        require(_maxStorage > 0, "Max storage is required");

        uint256 price = 0.01 ether; // hardcoded price

        require(msg.value == price, "Incorrect value sent, required 0.01 ether");

        Server memory newServer = Server(
            payable(msg.sender),
            payable(address(0)), // No client yet
            _maxStorage,
            _socket,
            price
        );

        servers.push(newServer);

        console.log("Public server created by %s", msg.sender);

        emit PublicServerCreated(msg.sender, _socket, _maxStorage, price, block.timestamp);
    }
}
