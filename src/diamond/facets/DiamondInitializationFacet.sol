// SPDX-License-Identifier: AGPL-1.0

pragma solidity 0.8.9;

import "../base/ImportingDiamondConstants.sol";
import "../base/ImportingDiamondEvents.sol";
import "../base/UsingDiamondDataLayout.sol";
import "hardhat-deploy/solc_0.8/diamond/UsingDiamondOwner.sol";

contract DiamondInitializationFacet is
    ImportingDiamondConstants,
    ImportingDiamondEvents,
    UsingDiamondOwner,
    UsingDiamondDataLayout
{
    bytes32 internal immutable _param1AsBytes32;
    struct Init {
        bytes32 param1AsBytes32;
    }

    constructor(Init memory init) {
        _param1AsBytes32 = init.param1AsBytes32;
    }

    function init() external onlyOwner {
        if (!_initialsed) {
            emit Initialized();
            _initialsed = true;
        }
    }
}
