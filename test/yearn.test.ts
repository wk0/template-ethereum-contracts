// import {expect} from './chai-setup';
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
  network,
} from 'hardhat';
import {setupUser, setupUsers} from './utils';
import {formatEther, formatUnits, parseEther} from 'ethers/lib/utils';
import {BigNumber} from '@ethersproject/bignumber';

const setup = deployments.createFixture(async () => {
  await deployments.fixture(undefined, {
    keepExistingDeployments: true, // global option to test network like that
  });
  const contracts = {
    yvDAI: await ethers.getContract('yvDAI'),
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
describe('yvDAI', function () {
  it('yvDAI works', async function () {
    const {daiHolder, Dai, yvDAI} = await setup();
    const balanceBefore = await Dai.callStatic.balanceOf(daiHolder.address);
    console.log({balanceBefore: formatEther(balanceBefore.toString())});
    const amount = parseEther('100');
    await daiHolder.Dai.approve(yvDAI.address, amount);
    await daiHolder.yvDAI['deposit(uint256)'](amount);

    const decimals = await yvDAI.decimals();
    const shares = await yvDAI.balanceOf(daiHolder.address);
    console.log({shares: formatUnits(shares, decimals), decimals});

    await network.provider.request({
      method: 'evm_increaseTime',
      params: [3600 * 24 * 365],
    });

    await network.provider.request({
      method: 'evm_mine',
      params: [],
    });

    const decimalsDiviser = BigNumber.from(10).pow(decimals);
    const pricePerShare = await yvDAI.pricePerShare();
    console.log({
      pricePerShare:
        pricePerShare.div(decimalsDiviser.div(1000)).toNumber() / 1000,
    });

    const newShares = await yvDAI.balanceOf(daiHolder.address);
    console.log({newShares: formatUnits(newShares, decimals), decimals});

    // await daiHolder.yvDAI.approve(yvDAI.address, withdrawAmount);
    await daiHolder.yvDAI['withdraw(uint256,address)'](
      newShares,
      daiHolder.address
    );
    const newDaiBalance = await Dai.callStatic.balanceOf(daiHolder.address);
    console.log({newDaiBalance: formatEther(newDaiBalance.toString())});
    // expect(newDaiBalance).to.be.gt(balanceBefore);
  });
});
