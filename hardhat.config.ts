import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'solidity-coverage';
import '@eth-optimism/plugins/hardhat/compiler';
import * as hdnode from '@ethersproject/hdnode';
import {node_url, accounts} from './utils/network';

// While waiting for hardhat PR: https://github.com/nomiclabs/hardhat/pull/1542
if (process.env.HARDHAT_FORK) {
  process.env['HARDHAT_DEPLOY_FORK'] = process.env.HARDHAT_FORK;
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.7.6',
  },
  ovm: {
    solcVersion: '0.7.6',
  },
  namedAccounts: {
    deployer: 0,
    simpleERC20Beneficiary: 1,
    l1Messenger: {
      default: 2,
      localhost: '0x6418E5Da52A3d7543d393ADD3Fa98B0795d27736',
    },
    l2Messenger: {
      default: '0x4200000000000000000000000000000000000007',
      hardhat: 2,
    },
    testUser:
      'privatekey://0xf14a6e4b68641b84ebef1c0f73cde544348429fe135272e111b946b38d329e16', // for test (see scripts folder)
  },
  networks: {
    hardhat: {
      // process.env.HARDHAT_FORK will specify the network that the fork is made from.
      // this line ensure the use of the corresponding accounts
      accounts: accounts(process.env.HARDHAT_FORK),
      forking: process.env.HARDHAT_FORK
        ? {
            // TODO once PR merged : network: process.env.HARDHAT_FORK,
            url: node_url(process.env.HARDHAT_FORK),
            blockNumber: process.env.HARDHAT_FORK_NUMBER
              ? parseInt(process.env.HARDHAT_FORK_NUMBER)
              : undefined,
          }
        : undefined,
      deploy: ['deploy_l1', 'deploy_l2'],
      companionNetworks: {
        l1: 'hardhat',
      },
    },
    localhost: {
      url: 'http://127.0.0.1:9545',
      // copy settings from https://github.com/ethereum-optimism/hardhat/blob/5c5ca2ca05a26dbb59f5a5b8cdabf010ec7ca5b7/hardhat.config.js
      accounts: {
        mnemonic:
          'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        path: hdnode.defaultPath,
        count: 8,
      },
      gasPrice: 0,
      deploy: ['deploy_l1'],
    },
    optimism: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
      deploy: ['deploy_l2'],
      ovm: true,
      companionNetworks: {
        l1: 'localhost',
      },
    },
    staging: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
    production: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
      deploy: ['deploy_l1'],
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
      deploy: ['deploy_l2'],
      companionNetworks: {
        l1: 'mainnet',
      },
    },
  },
  paths: {
    sources: 'src',
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
  },
};

export default config;
