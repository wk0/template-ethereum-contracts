import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer, proxy02Owner, simpleERC20Beneficiary} =
    await getNamedAccounts();

  await deploy('Proxy03', {
    contract: 'SimpleERC20',
    from: deployer,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    deterministicDeployment:
      '0x0000000000000000000000000000000000000000000000000000000000000003',
    proxy: {
      owner: proxy02Owner,
      viaAdminContract: {
        name: 'ProxyAdmin',
        artifact: 'ProxyAdmin',
      },
    },
    log: true,
  });

  await deploy('Proxy03', {
    contract: 'SimpleERC20_v2',
    from: proxy02Owner,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    deterministicDeployment:
      '0x0000000000000000000000000000000000000000000000000000000000000003',
    proxy: {
      owner: proxy02Owner,
      viaAdminContract: {
        name: 'ProxyAdmin',
        artifact: 'ProxyAdmin',
      },
    },
    log: true,
  });
};
export default func;
func.tags = ['Proxy02'];
