import React from 'react';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';

import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';

import imgBank from '../../assets/img/img_bank.png';
import useWhitelist from '../../hooks/useWhitelist';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import useBasisCash from '../../hooks/useBasisCash';
import { Deployments } from '../../basis-cash/deployments';
import { getBalance } from '../../utils/formatBalance';
import ERC20 from '../../basis-cash/ERC20';


// export enum RobotOperationType {
//   Stake,
//   Withdraw,
//   BuyFBG
// }

// export type RobotOperation = {
//   pool: Bank;
//   buyFBG: {
//     contractAddress: string;
//     contractName: string;
//   },
// }

export type RobotConfiguration = {
  privateKey: string;
  account: string;
  name: string;
  bankName: string,
  depositTokenName: string,
  depositTokenAddress: string,
  eranTokenName: string,
  eranTokenNameAddress: string,
  intervalMinitues: number
};

class Robot {
  wallet: Wallet;
  config: RobotConfiguration;
  provider: any;
  deployments: Deployments;
  name: string;
  pool: Contract;
  fbgSwapper: Contract;
  depositToken: ERC20;
  earnToken: ERC20;
  fbg: ERC20;

  stakeCount: number;
  stakeAmount: BigNumber;

  fbgBalance: BigNumber;
  earnBalance: BigNumber;
  depositBalance: BigNumber;

  rewardCount: number;
  rewardAmount: BigNumber;

  swapCount: number;
  swapAmount: BigNumber;

  depostionCount: number;
  depostionAmount: BigNumber;

  constructor(cfg: RobotConfiguration, deployments: Deployments) {

    this.config = cfg;
    this.deployments = deployments;
    this.name = this.config.name;

    this.stakeAmount = BigNumber.from(0);
    this.stakeCount = 0;

    this.rewardAmount = BigNumber.from(0);
    this.rewardCount = 0;

    this.swapAmount = BigNumber.from(0);
    this.swapCount = 0;

    this.depostionAmount = BigNumber.from(0);
    this.depostionCount = 0;

  }

  gasOptions(gas: BigNumber) {
    const multiplied = Math.floor(gas.toNumber() * 1.1);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied)
    };
  }


  start = (provider_: any) => {
    this.provider = provider_;
    this.wallet = new Wallet(this.config.privateKey, this.provider);


    this.pool = new Contract(
      this.deployments[this.config.bankName].address,
      this.deployments[this.config.bankName].abi,
      this.wallet);

    this.fbgSwapper = new Contract(
      this.deployments["FBGSwapper"].address,
      this.deployments["FBGSwapper"].abi,
      this.wallet);

    this.depositToken = new ERC20(this.config.depositTokenAddress, this.wallet, this.config.depositTokenName, 18);
    this.earnToken = new ERC20(this.config.eranTokenNameAddress, this.wallet, this.config.eranTokenName, 18);
    this.fbg = new ERC20(this.deployments.FBG.address, this.wallet, 'FBG', 18);

    this.startPool();
    const refreshBalance = setInterval(this.loop, this.config.intervalMinitues * 1000 * 60);

  }

  startPool = async () => {
    this.stakeLastest();
    this.loop();
  }

  // checkApprove = async () => {
  //   await this.depositToken.approve(this.pool.address, ethers.constants.MaxUint256);
  //   await this.earnToken.approve(this.fbgSwapper.address, ethers.constants.MaxUint256);
  // }


  stakeLastest = async () => {

    const allowance = await this.depositToken.allowance(this.config.account, this.pool.address);
    if (allowance.isZero() || allowance.isNegative()) {

      console.log("stakeLastest allowance not ok!");

      this.depositToken.approve(this.pool.address, ethers.constants.MaxUint256);

      return;
    }


    //query fbg balance, if >0.01 fbg, stakeFBG
    this.depositBalance = await this.depositToken.balanceOf(this.config.account);
    const depositBalanceNumber: number = getBalance(this.depositBalance, 18);
    if (depositBalanceNumber > 0.01) {
      const gas = await this.pool.estimateGas.stake(this.depositBalance);
      let result = await this.pool.stake(this.depositBalance, this.gasOptions(gas));
      console.log("result:" + JSON.stringify(result));
      if (result && result.hash) {

        this.depostionCount++;
        this.depostionAmount = this.depostionAmount.add(this.depositBalance);

        console.log(`[${this.name}]:do new despoit:${depositBalanceNumber}`);
      }
    } else {
      console.log("no new deposti to start");
    }

  }

  loop = async () => {
    console.log("loop called");
    this.stakeLastest();

    const depAllowance: BigNumber = await this.depositToken.allowance(this.config.account, this.pool.address);
    if (depAllowance.isZero() || depAllowance.isNegative()) {
      await this.depositToken.approve(this.pool.address, ethers.constants.MaxUint256);
      console.log("depositToken  allowance not ok!");
      return;
    }

    const earnAllowance: BigNumber = await this.earnToken.allowance(this.config.account, this.fbgSwapper.address);
    if (earnAllowance.isZero() || earnAllowance.isNegative()) {
      await this.earnToken.approve(this.fbgSwapper.address, ethers.constants.MaxUint256);
      console.log("earnToken  allowance not ok!");
      return;
    }

    const fbgAllowance: BigNumber = await this.fbg.allowance(this.config.account, this.pool.address);
    if (fbgAllowance.isZero() || fbgAllowance.isNegative()) {
      await this.fbg.approve(this.pool.address, ethers.constants.MaxUint256);
      console.log("fbg  allowance not ok!");
      return;
    }

    //query earnings, if >0.01, getReward 
    const earn: BigNumber = await this.pool.earned(this.config.account);
    const earnNumber: number = getBalance(earn, 16) / 100;
    console.log("earn balance = " + earnNumber);
    if (earnNumber > 0.01) {
      const gas = await this.pool.estimateGas.getReward();
      let result = await this.pool.getReward(this.gasOptions(gas));
      console.log("result:" + JSON.stringify(result));
      if (result && result.hash) {
        this.rewardCount++;
        this.rewardAmount = this.rewardAmount.add(earn);
        console.log(`[${this.name}]:do new reward:${earnNumber}`);
      }
      return;
    }

    //query fbc balance, if >0.01 FBC, buy fbg
    this.earnBalance = await this.earnToken.balanceOf(this.config.account);
    const fbcBalanceNumber: number = getBalance(this.earnBalance, 16) / 100;
    console.log("fbc balance = " + fbcBalanceNumber);
    if (fbcBalanceNumber > 0.01) {
      const gas = await this.fbgSwapper.estimateGas.swap(this.earnBalance);
      let result = await this.fbgSwapper.swap(this.earnBalance, this.gasOptions(gas));
      console.log("result:" + JSON.stringify(result));
      if (result && result.hash) {
        this.swapCount++;
        this.swapAmount = this.swapAmount.add(this.earnBalance);
        console.log(`[${this.name}]:do new buyfbg:${fbcBalanceNumber}`);
      }
      return;
    }

    //query fbg balance, if >0.01 fbg, stakeFBG
    this.fbgBalance = await this.fbg.balanceOf(this.config.account);
    const fbgBalanceNumber: number = getBalance(this.fbgBalance, 16) / 100;
    console.log("fbg balance = " + fbgBalanceNumber);
    if (fbgBalanceNumber > 0.01) {
      const gas = await this.pool.estimateGas.stakeFBG(this.fbgBalance);
      let result = await this.pool.stakeFBG(this.fbgBalance, this.gasOptions(gas));
      console.log("result:" + JSON.stringify(result));
      if (result && result.hash) {
        this.stakeCount++;
        this.stakeAmount = this.stakeAmount.add(this.fbgBalance);
        console.log(`[${this.name}]:do new stakeFBG:${fbgBalanceNumber}`);
      }
    }
  }
}

const RobotPage: React.FC = () => {
  const { joined, joinWhitelist } = useWhitelist();
  const { account, connect, ethereum } = useWallet();
  const basisCash = useBasisCash();
  let title = "Robot";
  let robot: Robot = null;
  let wallet: Wallet;
  let provider: any;

  const testConfig = {
    privateKey: "84ae2d8d3c1ee2cb4b7bd910dd82590d9769ce66450e389cc258370aaaa438a1",
    account: "0x14d234b468A32Ca411097e259956f5FEF2E8cd6a",
    name: "Robot-USDT-FBC",
    bankName: "USDT_AcceleratorCashPool",
    depositTokenName: "USDT",
    depositTokenAddress: "0x45Df2Ccc7a506D819C7c2d59Cfa44c73eda5C311",
    eranTokenName: "FBC",
    eranTokenNameAddress: "0xec4D0506Dcdae8157F99925119b7EaE0BDe7CB68",
    intervalMinitues: 2
  }

  const testConfig1 = {
    privateKey: "c82f91d0c858aaeb36dba13731e09867fd05424ffc3343f64a4ede29d0a73ea0",
    account: "0x14d234b468A32Ca411097e259956f5FEF2E8cd6a",
    name: "Robot-USDT-FBC",
    bankName: "USDT_AcceleratorCashPool",
    depositTokenName: "USDT",
    depositTokenAddress: "0x45Df2Ccc7a506D819C7c2d59Cfa44c73eda5C311",
    eranTokenName: "FBC",
    eranTokenNameAddress: "0xec4D0506Dcdae8157F99925119b7EaE0BDe7CB68",
    intervalMinitues: 2
  }


  


  const initRobot = () => {
    robot = new Robot(testConfig, basisCash.config.deployments);
    if (robot) {
      console.log("robot init:" + robot.name);
    }
  }

  const runRobot = () => {
    if (robot) {
      provider = new ethers.providers.Web3Provider(ethereum, basisCash.config.chainId);
      robot.start(provider);

      console.log("robot start:" + robot.name);
    }
  }

  // const initWallet = () => {
  //   provider = new ethers.providers.Web3Provider(ethereum, basisCash.config.chainId);
  //   wallet = new Wallet(testConfig.privateKey, provider);
  //   console.log("init success");
  // }


  // const sendTransaction = async () => {

  //   // let contract  = basisCash.contracts["USDT_AcceleratorCashPool"];
  //   const contract = new Contract(
  //     basisCash.config.deployments["USDT_AcceleratorCashPool"].address,
  //     basisCash.config.deployments["USDT_AcceleratorCashPool"].abi,
  //     wallet);

  //   const amount = parseUnits("1", 18);
  //   // debugger
  //   const gas = await contract.estimateGas.stake(amount);
  //   let promise = await contract.stake(amount, basisCash.gasOptions(gas));
  //   // promise.then((result: any) => {
  //   //   console.log(result);
  //   // })
  //   // First 4 bytes of the hash of "fee()" for the sighash selector
  //   // let data = ethers.utils.hexDataSlice(ethers.utils.id('stake()'), 0, 4);

  //   // let transaction = {
  //   //   to: address,
  //   //   data: data
  //   // }

  //   // let callPromise = provider.call(transaction);

  //   // callPromise.then((result:any) => {
  //   //   console.log(result);
  //   //   // "0x000000000000000000000000000000000000000000000000016345785d8a0000"
  //   //   // console.log(ethers.utils.formatEther(result));
  //   //   // "0.1"
  //   // });
  //   console.log("sent:" + JSON.stringify(promise));

  // }

  return (
    <Switch>
      <Page>
        <PageHeader
          icon={imgBank}
          title={title}
        />
        <StyleSubtitle>

        </StyleSubtitle>
        {/* <Center> */}

        {/* <Center>
          <Button onClick={initWallet} text="initWallet" />
        </Center>
        <Center>
          <Button onClick={sendTransaction} text="sendTransaction" />
        </Center> */}

        <Center>
          <Button onClick={initRobot} text="initRobot" />
        </Center>
        <Center>
          <Button onClick={runRobot} text="runRobot" />
        </Center>
        {/* </Center> */}
      </Page>
    </Switch>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.div`
  color: ${props => props.theme.color.grey[300]};
`;

const StyleSubtitle = styled.h3`
  color: #ffffff;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
  max-width: 640px;
  width: 80%;
`;

export default RobotPage;
