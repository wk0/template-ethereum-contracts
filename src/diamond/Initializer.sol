// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "hardhat/console.sol";

contract Initializer {
    function setMessage(string calldata message) external {
        console.log(message);
    }
}
