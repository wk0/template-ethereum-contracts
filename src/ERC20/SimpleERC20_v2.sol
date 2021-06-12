// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Base.sol";
import "./WithPermitAndFixedDomain.sol";

// solhint-disable-next-line contract-name-camelcase
contract SimpleERC20_v2 is ERC20Base, WithPermitAndFixedDomain {
    constructor(address to, uint256 amount) WithPermitAndFixedDomain("1") {
        _mint(to, amount);
    }

    string public constant symbol = "SIMPLE V2";

    function name() public pure override returns (string memory) {
        return "Simple ERC20 V2";
    }
}
