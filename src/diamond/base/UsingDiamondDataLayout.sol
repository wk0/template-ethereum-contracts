// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.8.9;

import "./ImportingDiamondTypes.sol";

contract UsingDiamondDataLayout is ImportingDiamondTypes {
    bool internal _initialsed;
    mapping(uint256 => TestData) internal _data;
}
