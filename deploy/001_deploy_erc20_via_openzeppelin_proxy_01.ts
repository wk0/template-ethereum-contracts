import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {
    deployer,
    proxy01Owner,
    simpleERC20Beneficiary,
  } = await getNamedAccounts();

  await deploy('Proxy01', {
    contract: 'SimpleERC20',
    from: deployer,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    proxy: {
      owner: proxy01Owner,
      proxyContract: 'OpenZeppelinTransparentProxy',
    },
    log: true,
  });

  await deploy('Proxy01', {
    contract: 'SimpleERC20_v2',
    from: proxy01Owner,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    proxy: {
      owner: proxy01Owner,
      proxyContract: 'OpenZeppelinTransparentProxy',
    },
    log: true,
  });
};
export default func;
func.tags = ['Proxy01'];
