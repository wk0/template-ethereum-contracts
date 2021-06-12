import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer, proxy01Owner, simpleERC20Beneficiary} =
    await getNamedAccounts();

  await deploy('SimpleERC20AlwaysProxied', {
    contract: 'SimpleERC20AlwaysProxied',
    from: deployer,
    proxy: {
      owner: proxy01Owner,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'init',
          args: [simpleERC20Beneficiary, parseEther('1000000000')],
        },
      },
    },
    log: true,
  });

  await deploy('SimpleERC20AlwaysProxied', {
    contract: 'SimpleERC20AlwaysProxied_v2',
    from: proxy01Owner,
    proxy: {
      owner: proxy01Owner,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'init',
          args: [simpleERC20Beneficiary, parseEther('1000000000')],
        },
      },
    },
    log: true,
  });
};
export default func;
func.tags = ['SimpleERC20AlwaysProxied'];
