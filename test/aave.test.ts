import {expect} from './chai-setup';
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
  network,
} from 'hardhat';
import {setupUser, setupUsers} from './utils';
import {parseEther} from 'ethers/lib/utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture(undefined, {
    keepExistingDeployments: true, // global option to test network like that
  });
  const contracts = {
    aToken_Dai: await ethers.getContract('aToken_Dai'),
    LendingPool: await ethers.getContract('LendingPool'),
    Dai: await ethers.getContract('Dai'),
  };
  const {daiHolder} = await getNamedAccounts();
  const daiHolderUser = await setupUser(daiHolder, contracts);
  const users = await setupUsers(await getUnnamedAccounts(), contracts);

  return {
    ...contracts,
    users,
    daiHolder: daiHolderUser,
  };
});
describe('aToken_Dai', function () {
  it('aToken_Dai works', async function () {
    const {daiHolder, Dai, LendingPool, aToken_Dai} = await setup();
    const balanceBefore = await Dai.callStatic.balanceOf(daiHolder.address);
    const amount = parseEther('100');
    await daiHolder.Dai.approve(LendingPool.address, amount);
    await daiHolder.LendingPool.deposit(
      Dai.address,
      amount,
      daiHolder.address,
      0
    );

    await network.provider.request({
      method: 'evm_increaseTime',
      params: [3600 * 24 * 365],
    });

    await network.provider.request({
      method: 'evm_mine',
      params: [],
    });

    const withdrawAmount = await aToken_Dai.balanceOf(daiHolder.address);
    await daiHolder.aToken_Dai.approve(LendingPool.address, withdrawAmount);
    await daiHolder.LendingPool.withdraw(
      Dai.address,
      withdrawAmount,
      daiHolder.address
    );
    // console.log({withdrawAmount: formatEther(withdrawAmount.toString())});
    const balanceAfter = await Dai.callStatic.balanceOf(daiHolder.address);
    expect(balanceAfter).to.be.gt(balanceBefore);
  });
});
