import { Fetcher, Route, Token } from '@uniswap/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, TreasuryAllocationTime } from './types';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import Web3Object from 'web3';
import { Web3Contract } from './web3Contract';
import { resolve } from 'path';



/**
 * An API module of FBSis Cash contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class BasisCash {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  wallet: ethers.Wallet;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;
  web3: Web3Object;
  web3Contracts: { [name: string]: Web3Contract };
  FBCUSDT: Contract;
  FBC: ERC20;
  FBS: ERC20;
  FBB: ERC20;
  FBG: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();
    this.web3 = cfg.defaultProvider ? new Web3Object(cfg.defaultProvider) : new Web3Object();


    // loads contracts from deployments
    this.contracts = {};
    this.web3Contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
      // this.web3Contracts[name] = new Web3Contract(this.web3, deployment.abi, deployment.address);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal); // TODO: add decimal
    }
    this.FBC = new ERC20(deployments.Cash.address, provider, 'FBC', 18);
    this.FBS = new ERC20(deployments.Share.address, provider, 'FBS', 18);
    this.FBB = new ERC20(deployments.Bond.address, provider, 'FBB', 18);
    this.FBG = new ERC20(deployments.FBG.address, provider, 'FBG', 18);


    // Uniswap V2 Pair
    this.FBCUSDT = new Contract(
      externalTokens['FBC_USDT_LP'][0],
      IUniswapV2PairABI,
      provider,
    );

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);

    this.web3 = provider ? new Web3Object(provider) : new Web3Object();

    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }

    for (const [name, deployment] of Object.entries(this.config.deployments)) {
      this.web3Contracts[name] = new Web3Contract(this.web3, deployment.abi, deployment.address);
    }

    const tokens = [this.FBC, this.FBS, this.FBB, this.FBG, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.FBCUSDT = this.FBCUSDT.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }

  /**
   * @returns FBSis Cash (FBC) stats from Uniswap.
   * It may differ from the FBC price used on Treasury (which is calculated in TWAP)
   */
  async getCashStatFromUniswap(): Promise<TokenStat> {
    const supply = await this.FBC.displayedTotalSupply();
    return {
      priceInUsdt: await this.getTokenPriceFromUniswap(this.FBC),
      totalSupply: supply,
    };
  }

  /**
   * @returns Estimated FBSis Cash (FBC) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getCashStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle } = this.contracts;

    const expectedPrice = await SeigniorageOracle.expectedPrice(
      this.FBC.address,
      ethers.utils.parseEther('1'),
    );
    const supply = await this.FBC.displayedTotalSupply();

    return {
      priceInUsdt: getDisplayBalance(expectedPrice),
      totalSupply: supply,
    };
  }

  async getCashPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getSeigniorageOraclePrice();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondOraclePrice();
  }

  async getBondStat(): Promise<TokenStat> {
    const decimals = BigNumber.from(10).pow(18);

    const cashPrice: BigNumber = await this.getBondOraclePriceInLastTWAP();
    const bondPrice = cashPrice.pow(2).div(decimals);

    return {
      priceInUsdt: getDisplayBalance(bondPrice),
      totalSupply: await this.FBB.displayedTotalSupply(),
    };
  }

  async getShareStat(): Promise<TokenStat> {
    return {
      priceInUsdt: await this.getTokenPriceFromUniswap(this.FBS),
      totalSupply: await this.FBS.displayedTotalSupply(),
    };
  }

  async getTokenPriceFromUniswap(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    const { chainId } = this.config;
    const { USDT } = this.config.externalTokens;
    const usdt = new Token(chainId, USDT[0], 6);
    const token = new Token(chainId, tokenContract.address, 18);

    try {
      const usdtToToken = await Fetcher.fetchPairData(usdt, token, this.provider);
      const priceInUsdt = new Route([usdtToToken], token);
      return priceInUsdt.midPrice.toSignificant(3);
    } catch (err) {

      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.buyBonds(
      decimalToBalance(amount),
      await this.getBondOraclePriceInLastTWAP(),
    );
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.redeemBonds(decimalToBalance(amount));
  }

  async earnedFromBank(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.earned(account);
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(
    poolName: ContractName,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceOf(account);
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async acceleratorEarnedFromBank(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.acceleratorEarned(account);
    } catch (err) {
      console.error(`Failed to call acceleratorEarned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async acceleratorStakedBalanceOnBank(
    poolName: ContractName,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceFBGOf(account);
    } catch (err) {
      console.error(`Failed to call balanceFBGOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async acceleratorStake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {

    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.stakeFBG(amount);
    return await pool.stakeFBG(amount, this.gasOptions(gas));
  }

  async acceleratorUnstake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {

    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.withdrawFBG(amount);
    return await pool.withdrawFBG(amount, this.gasOptions(gas));
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.stake(amount);
    return await pool.stake(amount, this.gasOptions(gas));
  }

  /**
 * Deposits token to given pool.
 * @param poolName A name of pool contract.
 * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
 * @returns {string} Transaction hash
 */
  async stakeETH(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    // debugger
    // const pool = this.contracts[poolName];
    // const gas = await pool.estimateGas.stake(amount);
    // return await pool.stake(amount, this.gasOptions(gas));

    const contract = this.web3Contracts[poolName].contract;
    const value = amount.toString();//this.web3.utils.toWei(valueString)
    return await contract.methods
      .stake()
      .send({
        to: contract.options.address,
        from: this.myAccount,
        value: value
      })
      .once('transactionHash', (data: any) => {
        console.log("transactionHash:" + data);
        resolve();
      })
      .once('receipt', (data: any) => {
        console.log("receipt" + JSON.stringify(data));
      })
      .on('error', (error: Error) => {
        console.log(error);
      });

    /**
     *     
     * transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
     */
    // const contract = this.web3Contracts[poolName].contract;
    // const value = amount.toString();//this.web3.utils.toWei(valueString)
    // let p = new Promise<TransactionResponse>(() => {
    //     contract.methods
    //       .stake()
    //       .send({
    //         to: contract.options.address,
    //         from: this.myAccount,
    //         value: value
    //       })
    //       .once('transactionHash',(txHash:string)  => {
    //         console.log("transactionHash:"+txHash);
    //         result:TransactionResponse = {
    //           hash:txHash,
    //           confirmations: 0,
    //           from: this.myAccount
    //         }
    //         resolve(result);
    //       })
    //       .once('receipt', (error: Error, event: any) => {
    //         console.log("transactionHash:"+event);
    //       })
    //       .on('error', (error: Error) => {
    //         console.log(error);
    //       });
    //   });

    //   return p;
  }

  async unstakeETH(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    // const pool = this.contracts[poolName];
    // const gas = await pool.estimateGas.withdraw(amount);
    // return await pool.withdraw(amount, this.gasOptions(gas));
    const contract = this.web3Contracts[poolName].contract;
    const value = this.web3.utils.toWei("0")
    // let p = new Promise<TransactionResponse>(()=>
    // {

    // });

    return await contract.methods
      .withdraw(amount)
      .send({
        to: contract.options.address,
        from: this.myAccount,
        value: value
      })
      .once('transactionHash', (txHash: string) => {
        console.log("transactionHash");
      })
      .once('receipt', () => {
        console.log("receipt");
      })
      .on('error', (error: Error) => {
        console.log(error);
      });

  }


  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.withdraw(amount);
    return await pool.withdraw(amount, this.gasOptions(gas));
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.getReward();
    return await pool.getReward(this.gasOptions(gas));
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.exit();
    return await pool.exit(this.gasOptions(gas));
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    const { Boardroom1, Boardroom2 } = this.contracts;
    const balance1 = await Boardroom1.getShareOf(this.myAccount);
    if (balance1.gt(0)) {
      console.log(
        `👀 The user is using Boardroom v1. (Staked ${getDisplayBalance(balance1)} FBS)`,
      );
      return 'v1';
    }
    const balance2 = await Boardroom2.balanceOf(this.myAccount);
    if (balance2.gt(0)) {
      console.log(
        `👀 The user is using Boardroom v2. (Staked ${getDisplayBalance(balance2)} FBS)`,
      );
      return 'v2';
    }
    return 'latest';
  }

  boardroomByVersion(version: string): Contract {
    if (version === 'v1') {
      return this.contracts.Boardroom1;
    }
    if (version === 'v2') {
      return this.contracts.Boardroom2;
    }
    return this.contracts.Boardroom3;
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      throw new Error('you must unlock the wallet to continue.');
    }
    return this.boardroomByVersion(this.boardroomVersionOfUser);
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old Boardroom. please withdraw and deposit the FBS again.");
    }
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getCashEarningsOf(this.myAccount);
    }
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<TreasuryAllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const period: BigNumber = await Treasury.getPeriod();

    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(nextAllocation.getTime() - period.toNumber() * 1000);
    return { prevAllocation, nextAllocation };
  }
}
