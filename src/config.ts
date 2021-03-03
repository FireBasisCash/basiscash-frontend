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

      USDT: ['0x45Df2Ccc7a506D819C7c2d59Cfa44c73eda5C311', 6],

      'FBS_USDT_LP': ['0x2F5684996808A17CC5C1C95495504D599f62262d', 18],
      'FBC_USDT_LP': ['0xaB707042f31AfeD5FDF440D9f2C2Bba45F855844', 18]
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

      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'FBS_USDT_LP': ['0x2F5684996808A17CC5C1C95495504D599f62262d', 18],
      'FBC_USDT_LP': ['0xaB707042f31AfeD5FDF440D9f2C2Bba45F855844', 18]
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
    name: 'FBG Pool',
    contract: 'FBG_FBCPool',
    depositTokenName: 'FBG',
    earnTokenName: 'FBC',
    finished: false,
    sort: 1,
    accelerator:false,
    acceleratorTokenName: 'FBG'
  },

  // FBS
  FBCUSDTLPTokenSharePool: {
    name: 'FBC_USDT_LP Pool',
    contract: 'FBCUSDTLPTokenSharePool',
    depositTokenName: 'FBC_USDT_LP',
    earnTokenName: 'FBS',
    finished: false,
    sort: 4,
    accelerator:false,
    acceleratorTokenName: 'FBG'
  },
  FBSUSDTLPTokenSharePool: {
    name: 'FBS_USDT_LP Pool',
    contract: 'FBSUSDTLPTokenSharePool',
    depositTokenName: 'FBS_USDT_LP',
    earnTokenName: 'FBS',
    finished: false,
    sort: 5,
    accelerator:false,
    acceleratorTokenName: 'FBG'
  },

  //FBS + FBG
  FBCUSDTLPTokenAcceleratorSharePool: {
    name: 'FBC_USDT_LP Pool(FBG)',
    contract: 'FBC_USDT_AcceleratorSharePool',
    depositTokenName: 'FBC_USDT_LP',
    earnTokenName: 'FBS',
    finished: false,
    sort: 7,
    accelerator:true,
    acceleratorTokenName: 'FBG'
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
