import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers} = hre;

  const aToken_Dai = await ethers.getContractOrNull('aToken_Dai');

  if (!aToken_Dai) {
    const Dai = await ethers.getContract('Dai');

    const LendingPoolAddressesProvider = await ethers.getContract(
      'LendingPoolAddressesProvider'
    );
    const ProtocolDataProviderAddress = await LendingPoolAddressesProvider.callStatic.getAddress(
      '0x0100000000000000000000000000000000000000000000000000000000000000'
    );

    // const ProtocolDataProvider = await ethers.getContractAt(
    //   'AaveProtocolDataProvider',
    //   ProtocolDataProviderAddress
    // );

    const ProtocolDataProvider = new ethers.Contract(
      ProtocolDataProviderAddress,
      [
        {
          constant: true,
          inputs: [
            {
              name: 'asset',
              type: 'address',
            },
          ],
          name: 'getReserveTokensAddresses',
          outputs: [
            {
              name: 'aTokenAddress',
              type: 'address',
            },
            {
              name: 'stableDebtTokenAddress',
              type: 'address',
            },
            {
              name: 'variableDebtTokenAddress',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ],
      ethers.provider
    );

    const {
      aTokenAddress,
    } = await ProtocolDataProvider.callStatic.getReserveTokensAddresses(
      Dai.address
    );

    const aTokenArtifact = await deployments.getExtendedArtifact('IAToken');

    await deployments.save('aToken_Dai', {
      address: aTokenAddress,
      ...aTokenArtifact,
    });
  }
};
export default func;
func.tags = ['aToken_Dai'];
