import {expect} from './chai-setup';
import {ethers, deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
import {setupUser, setupUsers} from './utils';
import {SimpleERC20} from '../typechain';
import {Interface, parseEther} from 'ethers/lib/utils';
import {MaxUint256} from '@ethersproject/constants';
import {Contract} from 'ethers';

const setup = deployments.createFixture(async () => {
  await deployments.fixture(['UniswapV2Router', 'SimpleERC20', 'SimpleERC20Bis']);
  const contracts = {
    UniswapV2Router: await ethers.getContract('UniswapV2Router'),
    SimpleERC20: <SimpleERC20>await ethers.getContract('SimpleERC20'),
    SimpleERC20Bis: <SimpleERC20>await ethers.getContract('SimpleERC20Bis'),
  };
  contracts.UniswapV2Router = new Contract(
    contracts.UniswapV2Router.address,
    new Interface(
      (contracts.UniswapV2Router.interface.format('full') as string[]).concat([
        'event Mint(address indexed sender, uint amount0, uint amount1)',
      ])
    ),
    contracts.UniswapV2Router.provider
  );
  const {simpleERC20Beneficiary: simpleERC20BeneficiaryAddress} = await getNamedAccounts();
  const simpleERC20Beneficiary = await setupUser(simpleERC20BeneficiaryAddress, contracts);
  const unamedAccounts = await getUnnamedAccounts();
  const userWithToken = await setupUser(unamedAccounts[0], contracts);
  const users = await setupUsers(unamedAccounts.slice(1), contracts);

  await simpleERC20Beneficiary.SimpleERC20.transfer(userWithToken.address, parseEther('1000000'));
  await simpleERC20Beneficiary.SimpleERC20Bis.transfer(userWithToken.address, parseEther('1000000'));

  return {
    ...contracts,
    users,
    userWithToken,
  };
});
describe('UniswapV2Router', function () {
  it('addLiquidity', async function () {
    const {userWithToken, UniswapV2Router, SimpleERC20, SimpleERC20Bis} = await setup();
    await userWithToken.SimpleERC20.approve(UniswapV2Router.address, MaxUint256);
    await userWithToken.SimpleERC20Bis.approve(UniswapV2Router.address, MaxUint256);

    const tx = await userWithToken.UniswapV2Router.functions.addLiquidity(
      SimpleERC20.address,
      SimpleERC20Bis.address,
      parseEther('100'),
      parseEther('100000'),
      parseEther('100'),
      parseEther('100000'),
      userWithToken.address,
      MaxUint256
    );
    const receipt = await tx.wait();
    expect(receipt.events[receipt.events.length - 1].event === 'Mint');
    expect(receipt.events[receipt.events.length - 1].args[0] === userWithToken.address);
    expect(receipt.events[receipt.events.length - 1].args[1]).to.be.equal(parseEther('100000'));
    expect(receipt.events[receipt.events.length - 1].args[2]).to.be.equal(parseEther('100'));
  });
});
