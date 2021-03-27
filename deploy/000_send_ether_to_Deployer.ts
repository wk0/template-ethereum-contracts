import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {rawTx} = deployments;

  const {deployer, simpleERC20Beneficiary} = await getNamedAccounts();

  await rawTx({
    from: simpleERC20Beneficiary,
    to: deployer,
    value: parseEther('1'),
    log: true,
  });
};
export default func;
func.tags = ['SimpleERC20'];
