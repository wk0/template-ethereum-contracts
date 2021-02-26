const func = async function (hre) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('ERC20TransferGateway', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });
};
export default func;
func.tags = ['ERC20TransferGateway'];
