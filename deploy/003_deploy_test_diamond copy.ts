import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {diamond} = deployments;

  const {deployer} = await getNamedAccounts();

  await diamond.deploy('TestDiamond', {
    from: deployer,
    // facets: ['DiamondInitializationFacet', 'FacetTest1', 'FacetTest2'],
    // facets: [{name: 'DiamondInitializationFacet'}, {name: 'FacetTest1'}, {name: 'FacetTest2'}],
    // facets: [
    //   {name: 'Facet1', contract: 'DiamondInitializationFacet'},
    //   {name: 'Facet2', contract: 'FacetTest1'},
    //   {name: 'Facet3', contract: 'FacetTest2'},
    // ],
    facets: [{contract: 'DiamondInitializationFacet'}, {contract: 'FacetTest1Bis'}, {contract: 'FacetTest2'}], // will prepend TestDiamond_facet_ to each facet name
    facetsArgs: [
      {param1AsBytes32: '0x0000000000000000000000000000000000000000000000000000000000000001', param2AsUInt8: 5},
    ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  await diamond.deploy('TestDiamond', {
    from: deployer,
    facets: [{contract: 'DiamondInitializationFacet'}, {contract: 'FacetTest1'}, {contract: 'FacetTest2'}], // will prepend TestDiamond_facet_ to each facet name
    facetsArgs: [
      {param1AsBytes32: '0x0000000000000000000000000000000000000000000000000000000000000001', param2AsUInt8: 5},
    ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
};
export default func;
func.tags = ['TestDiamond'];
