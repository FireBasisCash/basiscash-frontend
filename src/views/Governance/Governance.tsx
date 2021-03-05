import React, { useCallback, useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBasisCash from '../../hooks/useBasisCash';

import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber } from 'ethers';
import useFBGSwapper from '../../hooks/useFBGSwapper';

const Governance: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const basisCash = useBasisCash();

  const cashBalance = useTokenBalance(basisCash?.FBC);
  const { swapperInfo, handleSwap } = useFBGSwapper();

  const getRateDes = (rate: BigNumber) => {
    // console.log("rate" + rate);
    let rateNumber = rate ? 10000 / rate.toNumber() : 0;
    return (`1${basisCash.FBC.symbol} = ` + rateNumber + `${basisCash.FBG.symbol}`);
  }

  const getLevelDes = (currentLevel: BigNumber, totoalLevel: BigNumber,) => {
    // console.log("rate" + rate);

    return (`` + currentLevel.toString() + ` / ` + totoalLevel.toString());
  }

  const getLevelCountDes = (levelLeft: BigNumber, levelCount: BigNumber) => {
    return (`` + getDisplayBalance(levelLeft) + ` / ` + levelCount.toString());
  }

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                // icon={'🏦'}
                title="Get Governance"
                subtitle="Swap FBC to FBG"
              />
            </Route>
            <StyledBond>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="FBC"
                  description="Fire Basisc Cash Destroyed"
                  count={getDisplayBalance(swapperInfo ? swapperInfo.swappedFBCCount : BigNumber.from(0))}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="FBG"
                  description="Fire Basisc Governance Swapped"
                  count={getDisplayBalance(swapperInfo ? swapperInfo.swappedFBGCount : BigNumber.from(0))}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Swap "
                  fromToken={basisCash.FBC}
                  fromTokenName="Fire Basis Cash"
                  toToken={basisCash.FBG}
                  toTokenName="Fire Basis Governance"
                  priceDesc={`${getDisplayBalance(cashBalance)} FBC Available`}
                  onExchange={handleSwap}
                  disabled={cashBalance.isZero()}
                  disabledDescription={"swap"}
                  rateDesc={getRateDes(swapperInfo ? swapperInfo.swapRate : null)}
                  levelDesc={getLevelDes(swapperInfo ? swapperInfo.currentLevel : BigNumber.from(0), BigNumber.from(100))}
                  levelCountDesc={getLevelCountDes(swapperInfo ? swapperInfo.leftCountInLevel : BigNumber.from(0), BigNumber.from(10000))}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            </div>
          )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Governance;
