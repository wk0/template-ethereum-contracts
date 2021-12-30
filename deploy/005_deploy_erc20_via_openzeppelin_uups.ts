import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer, proxy01Owner, simpleERC20Beneficiary} = await getNamedAccounts();

  await deploy('SimpleERC20_via_UUPS', {
    contract: 'SimpleERC20UUPSReady',
    from: deployer,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    proxy: {
      proxyContract: 'ERC1967Proxy',
      proxyArgs: ['{implementation}', '{data}'],
      execute: {
        init: {
          methodName: 'init',
          args: [proxy01Owner, simpleERC20Beneficiary, parseEther('1000000000')],
        },
      },
    },
    log: true,
  });

  await deploy('SimpleERC20_via_UUPS', {
    contract: 'SimpleERC20UUPSReady_v2',
    from: proxy01Owner,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    proxy: {
      proxyContract: 'ERC1967Proxy',
      proxyArgs: ['{implementation}', '{data}'],
    },
    log: true,
  });
};
export default func;
func.tags = ['SimpleERC20'];
