// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Base.sol";
import "./WithPermitAndFixedDomain.sol";

contract SimpleERC20 is ERC20Base, WithPermitAndFixedDomain {
    constructor() WithPermitAndFixedDomain("1") {
        _mint(msg.sender, 1000000000000000000000000000000000);
    }

    string public constant symbol = "SIMPLE";

    function name() public pure override returns (string memory) {
        return "Simple ERC20";
    }
}
