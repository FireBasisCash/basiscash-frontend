import { Deployments } from './deployments';
import { ChainId } from '@uniswap/sdk';
import {Contract, ContractOptions} from 'web3-eth-contract';
import Web3 from 'web3';

export class Web3Contract {
  contract:Contract;

  constructor(web3:Web3,abi: any[],address?: string)
  {
    this.contract = new web3.eth.Contract(abi);
    this.contract.options.address = address;
  }
};

