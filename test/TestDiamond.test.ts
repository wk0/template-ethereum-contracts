import {expect} from './chai-setup';
import {ethers, deployments, getUnnamedAccounts} from 'hardhat';
import {setupUsers} from './utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture('TestDiamond');
  const contracts = {
    TestDiamond: await ethers.getContract('TestDiamond'),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
  };
});
describe('TestDiamond', function () {
  it('testing', async function () {
    const {users, TestDiamond} = await setup();
    const testMessage = 'Hello World';
    // await expect(users[0].TestDiamond.setMessage(testMessage))
    //   .to.emit(GreetingsRegistry, 'MessageChanged')
    //   .withArgs(users[0].address, testMessage);

    await users[0].TestDiamond.test1();
    await users[0].TestDiamond.test2();
  });
});
