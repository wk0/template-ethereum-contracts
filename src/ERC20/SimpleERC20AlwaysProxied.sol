// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Base.sol";
import "./WithPermitAndFixedDomain.sol";
import "hardhat-deploy/solc_0.7/proxy/Proxied.sol";

contract SimpleERC20AlwaysProxied is ERC20Base, WithPermitAndFixedDomain, Proxied {
    // solhint-disable-next-line no-empty-blocks
    constructor() WithPermitAndFixedDomain("1") {}

    function init(address to, uint256 amount) public proxied {
        _mint(to, amount);
    }

    string public constant symbol = "SIMPLE";

    function name() public pure override returns (string memory) {
        return "Simple ERC20";
    }
}
