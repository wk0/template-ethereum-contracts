import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {execute} = deployments;
  const {deployer} = await getNamedAccounts();

  const OVM_L1ERC20Gateway = await hre.companionNetworks['l1'].deployments.get(
    'OVM_L1ERC20Gateway'
  ); // layer 1

  await execute(
    'SimpleERC20_OVM',
    {from: deployer, log: true},
    'init',
    OVM_L1ERC20Gateway.address
  );
};
export default func;
func.tags = ['SimpleERC20_OVM', 'SimpleERC20_OVM_init'];
func.dependencies = ['OVM_L1ERC20Gateway'];
