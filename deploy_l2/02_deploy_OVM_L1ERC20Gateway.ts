import * as optimism from '@eth-optimism/contracts';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Layer 1
  const {deployments, getNamedAccounts} = hre.companionNetworks['l1'];
  const {deploy} = deployments;
  const {deployer, l1Messenger} = await getNamedAccounts();

  const MyERC20 = await deployments.get('SimpleERC20');
  const MyL2DepositedERC20 = await hre.deployments.get('SimpleERC20_OVM'); // from Layer 2

  // TODO type check: any ?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OVM_L1ERC20Gateway = (optimism as any).getContractDefinition(
    'OVM_L1ERC20Gateway'
  );
  await deploy('OVM_L1ERC20Gateway', {
    from: deployer,
    contract: OVM_L1ERC20Gateway,
    args: [MyERC20.address, MyL2DepositedERC20.address, l1Messenger],
    log: true,
  });
};
export default func;
func.tags = ['SimpleERC20_OVM', 'OVM_L1ERC20Gateway'];
func.dependencies = ['SimpleERC20'];
