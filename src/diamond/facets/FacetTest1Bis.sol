// SPDX-License-Identifier: AGPL-1.0

pragma solidity 0.8.9;

import "../base/ImportingDiamondConstants.sol";
import "../base/ImportingDiamondEvents.sol";
import "../base/UsingDiamondDataLayout.sol";

import "hardhat/console.sol";

contract FacetTest1Bis is ImportingDiamondConstants, ImportingDiamondEvents, UsingDiamondDataLayout {
    uint8 internal immutable _param2AsUInt8;
    struct Init {
        uint8 param2AsUInt8;
    }

    constructor(Init memory init) {
        _param2AsUInt8 = init.param2AsUInt8;
    }

    function test1() external {
        console.log("test1bis const %i immutable %i", TEST, _param2AsUInt8);
    }
}
