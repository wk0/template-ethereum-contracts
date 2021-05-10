import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer, l2Messenger} = await getNamedAccounts();

  await deploy('SimpleERC20_OVM', {
    from: deployer,
    args: [l2Messenger],
    log: true,
  });
};
export default func;
func.tags = ['SimpleERC20_OVM', 'SimpleERC20_OVM_deploy'];
