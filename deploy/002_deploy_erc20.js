const func = async function (hre) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const erc20TransferGateway = await deployments.get('ERC20TransferGateway');

  await deploy('ERC20Token', {
    from: deployer,
    contract: 'ERC20WithInitialBalance',
    args: [
      '10000000000000000000',
      '1000000000000000000000000000',
      erc20TransferGateway.address,
    ],
    log: true,
  });
};
export default func;
func.tags = ['ERC20Token'];
func.dependencies = ['ERC20TransferGateway'];
