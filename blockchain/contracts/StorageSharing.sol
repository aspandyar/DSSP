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

    struct Server {
        address payable owner;
        string socket;
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
}
