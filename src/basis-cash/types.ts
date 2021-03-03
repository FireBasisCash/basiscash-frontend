import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  accelerator : boolean;
  acceleratorTokenName: ContractName;
}

export interface Bank extends  BankInfo {
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
