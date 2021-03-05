import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  accelerator: boolean;
  acceleratorTokenName: ContractName;
}

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
  acceleratorToken: ERC20;
}

export type TokenStat = {
  priceInUsdt: string;
  totalSupply: string;
};

export type TreasuryAllocationTime = {
  prevAllocation: Date;
  nextAllocation: Date;
}

export type Web3TXResponse = {
  error: Error,
  summary: string,
  data: any
}

export type FBGSwapperInfo = {
  swappedFBGCount: BigNumber;
  avaliableFBGCount: BigNumber;
  totalFBGCount: BigNumber;
  swappedFBCCount: BigNumber;
  swapRate: BigNumber;
  currentLevel: BigNumber;
  leftCountInLevel: BigNumber;
};

export type PoolProfitRate = {
  tvl: string;
  apy: string;
  apd: string;
  totalCount: string;
};