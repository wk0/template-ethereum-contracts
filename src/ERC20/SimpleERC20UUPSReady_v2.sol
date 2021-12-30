// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Base.sol";
import "./WithPermitAndFixedDomain.sol";
import "hardhat-deploy/solc_0.8/proxy/Proxied.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

// solhint-disable-next-line contract-name-camelcase
contract SimpleERC20UUPSReady_v2 is ERC20Base, WithPermitAndFixedDomain, Proxied, UUPSUpgradeable {
    constructor(address to, uint256 amount) WithPermitAndFixedDomain("1") {
        _mint(to, amount);
    }

    string public constant symbol = "SIMPLE_V2";

    function name() public pure override returns (string memory) {
        return "Simple ERC20 V2";
    }

    function _authorizeUpgrade(address) internal override proxied {}
}
