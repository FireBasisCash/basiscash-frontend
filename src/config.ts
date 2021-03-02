import { ChainId } from '@uniswap/sdk';
import { Configuration } from './basis-cash/config';
import { BankInfo } from './basis-cash';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.GÖRLI,
    etherscanUrl: 'https://goerli.etherscan.io',
    defaultProvider: 'https://goerli.infura.io/v3/f7af27e963cb41cbb46973bcc2d7944c',
    deployments: require('./basis-cash/deployments/deployments.goerli.json'),
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0x45Df2Ccc7a506D819C7c2d59Cfa44c73eda5C311', 6],
      FBG: ['0x1354A32f5cbe6E7F41e3d518F7c682a6343018EE', 18],
      'BAC_DAI-UNI-LPv2': ['0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD', 18],
      'BAS_DAI-UNI-LPv2': ['0x0379dA7a5895D13037B6937b109fA8607a659ADF', 18],
      'FBS_USDT-UNI-LPv2': ['0x2F5684996808A17CC5C1C95495504D599f62262d', 18],
      'FBC_USDT-UNI-LPv2': ['0xaB707042f31AfeD5FDF440D9f2C2Bba45F855844', 18]
    },
    baseLaunchDate: new Date('2020-11-26T00:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    chainId: ChainId.MAINNET,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'https://mainnet.infura.io/v3/06ecf536272c43c78adfba29b908a68d',
    deployments: require('./basis-cash/deployments/deployments.mainnet.json'),
    externalTokens: {
      FBG: ['0x1354A32f5cbe6E7F41e3d518F7c682a6343018EE', 18],
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'BAC_DAI-UNI-LPv2': ['0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD', 18],
      'BAS_DAI-UNI-LPv2': ['0x0379dA7a5895D13037B6937b109fA8607a659ADF', 18],
      'FBS_USDT-UNI-LPv2': ['0xe14fecd9d8bbde476dee2d31613ae6f00d066e01', 18],
      'FBC_USDT-UNI-LPv2': ['0xaB707042f31AfeD5FDF440D9f2C2Bba45F855844', 18]
    },
    baseLaunchDate: new Date('2020-11-29T23:00:00Z'),
    bondLaunchesAt: new Date('2020-12-05T00:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  // FBC
  FBG_FBCPool: {
    name: 'Earn FBC by FBG',
    contract: 'FBG_FBCPool',
    depositTokenName: 'FBG',
    earnTokenName: 'FBC',
    finished: false,
    sort: 1,
  },

  // FBS
  FBCUSDTLPTokenSharePool: {
    name: 'Earn FBS by FBC-USDT-LP',
    contract: 'FBCUSDTLPTokenSharePool',
    depositTokenName: 'FBC_USDT-UNI-LPv2',
    earnTokenName: 'FBS',
    finished: false,
    sort: 4,
  },
  FBSUSDTLPTokenSharePool: {
    name: 'Earn FBS by FBS-USDT-LP',
    contract: 'FBSUSDTLPTokenSharePool',
    depositTokenName: 'FBS_USDT-UNI-LPv2',
    earnTokenName: 'FBS',
    finished: false,
    sort: 5,
  },
  // FBGUSDTLPTokenSharePool: {
  //   name: 'Earn FBS by FBG-USDT-LP',
  //   contract: 'FBGUSDTLPTokenSharePool',
  //   depositTokenName: 'FBG_USDT-UNI-LPv2',
  //   earnTokenName: 'FBS',
  //   finished: false,
  //   sort: 6,
  // },
};

export default configurations[process.env.NODE_ENV || "development"];
