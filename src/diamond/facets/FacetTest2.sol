// SPDX-License-Identifier: AGPL-1.0

pragma solidity 0.8.9;

import "../base/ImportingDiamondConstants.sol";
import "../base/ImportingDiamondEvents.sol";
import "../base/UsingDiamondDataLayout.sol";

import "hardhat/console.sol";

contract FacetTest2 is ImportingDiamondConstants, ImportingDiamondEvents, UsingDiamondDataLayout {
    function test2() external {
        console.log("test2");
    }
}
