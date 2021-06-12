// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Base.sol";
import "./WithPermitAndFixedDomain.sol";

import {Abs_L2DepositedToken} from "@eth-optimism/contracts/build/contracts/OVM/bridge/tokens/Abs_L2DepositedToken.sol";

/**
 * @title SimpleERC20_OVM
 * @dev An L2 Deposited ERC20 is an ERC20 implementation which represents L1 assets deposited into L2, minting and burning on
 * deposits and withdrawals.
 *
 * `SimpleERC20_OVM` uses the Abs_L2DepositedToken class provided by optimism to link into a standard L1 deposit contract
 * while using the `MyERC20`implementation I as a developer want to use.
 *
 * Compiler used: optimistic-solc
 * Runtime target: OVM
 */
// solhint-disable-next-line contract-name-camelcase
contract SimpleERC20_OVM is Abs_L2DepositedToken, ERC20Base, WithPermitAndFixedDomain {
    constructor(address _l2CrossDomainMessenger)
        Abs_L2DepositedToken(_l2CrossDomainMessenger)
        WithPermitAndFixedDomain("1")
    // solhint-disable-next-line no-empty-blocks
    {

    }

    string public constant symbol = "ovmSIMPLE";

    function name() public pure override returns (string memory) {
        return "OVM Simple ERC20";
    }

    // solhint-disable-next-line no-unused-vars
    function _handleInitiateWithdrawal(address _to, uint256 _amount) internal override {
        _burnFrom(msg.sender, _amount);
    }

    function _handleFinalizeDeposit(address _to, uint256 _amount) internal override {
        _mint(_to, _amount);
    }
}
