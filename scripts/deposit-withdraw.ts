import {Web3Provider, ExternalProvider} from '@ethersproject/providers';
import {Watcher} from '@eth-optimism/watcher';
import {
  deployments,
  getNamedAccounts,
  companionNetworks,
  network,
} from 'hardhat';
const {execute} = deployments;

async function showBalance(testUser: string) {
  const balance = await companionNetworks.l1.deployments.read(
    'SimpleERC20',
    'balanceOf',
    testUser
  );
  console.log({SimpleERC20: balance.toString()});
  const balance2 = await deployments.read(
    'SimpleERC20_OVM',
    'balanceOf',
    testUser
  );
  console.log({SimpleERC20_OVM: balance2.toString()});
}

async function main() {
  const {l1Messenger: l1MessengerAddress} =
    await companionNetworks.l1.getNamedAccounts();
  const {l2Messenger: l2MessengerAddress, testUser} = await getNamedAccounts();

  const watcher = new Watcher({
    l1: {
      provider: new Web3Provider(
        companionNetworks.l1.provider as unknown as ExternalProvider
      ),
      messengerAddress: l1MessengerAddress,
    },
    l2: {
      provider: new Web3Provider(
        network.provider as unknown as ExternalProvider
      ),
      messengerAddress: l2MessengerAddress,
    },
  });

  await showBalance(testUser);

  const OVM_L1ERC20Gateway = await companionNetworks.l1.deployments.get(
    'OVM_L1ERC20Gateway'
  );
  await companionNetworks.l1.deployments.execute(
    'SimpleERC20',
    {from: testUser, log: true},
    'approve',
    OVM_L1ERC20Gateway.address,
    1
  );
  const receipt = await companionNetworks.l1.deployments.execute(
    'OVM_L1ERC20Gateway',
    {from: testUser, log: true},
    'deposit',
    1
  );
  console.log({txHash: receipt.transactionHash});

  await showBalance(testUser);

  const [l1ToL2msgHash] = await watcher.getMessageHashesFromL1Tx(
    receipt.transactionHash
  );
  console.log('got L1->L2 message hash', l1ToL2msgHash);
  const l2Receipt = await watcher.getL2TransactionReceipt(l1ToL2msgHash);
  console.log('completed Deposit! L2 tx hash:', l2Receipt.transactionHash);

  await showBalance(testUser);

  const receipt2 = await execute(
    'SimpleERC20_OVM',
    {from: testUser, log: true},
    'withdraw',
    1
  );
  console.log({txHash: receipt2.transactionHash});

  await showBalance(testUser);

  const [l2ToL1msgHash] = await watcher.getMessageHashesFromL2Tx(
    receipt2.transactionHash
  );
  console.log('got L2->L1 message hash', l2ToL1msgHash);
  const l1Receipt = await watcher.getL1TransactionReceipt(l2ToL1msgHash);
  console.log('completed Withdrawal! L1 tx hash:', l1Receipt.transactionHash);

  await showBalance(testUser);
}

main().catch((e) => console.error(e));
