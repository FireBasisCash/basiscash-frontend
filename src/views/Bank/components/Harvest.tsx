import React from 'react';
import styled from 'styled-components';

import { BigNumber, Contract } from 'ethers';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

import { getBalance, getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../basis-cash';
import useAcceleratorEarnings from '../../../hooks/useAcceleratorEarnings';

interface HarvestProps {
  bank: Bank;
}

const Harvest: React.FC<HarvestProps> = ({ bank }) => {
  const totalEarnings = useEarnings(bank.contract);
  const acceleratorEarnings = useAcceleratorEarnings(bank.contract);
  const tokenEarnings = totalEarnings.sub(acceleratorEarnings);
  const { onReward } = useHarvest(bank);

  const getDisplayAcceleratePercent = (acceleratorEarnings: BigNumber, tokenEarnings: BigNumber) => {
    if (tokenEarnings.isZero())
      return "0.0%";
    if (acceleratorEarnings.isZero())
      return "0.0%";

    const acceleratorEarningsNumber: number = getBalance(acceleratorEarnings,14);
    const tokenEarningsNumber: number = getBalance(tokenEarnings,14);
    let ratePercent = acceleratorEarningsNumber/tokenEarningsNumber;
    ratePercent = ratePercent*100;
    return ratePercent.toFixed(2) + "%";
  }

  const tokenName = bank.earnTokenName; // 'FBS' ? 'Share' : 'Cash'
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.earnToken.symbol} size={54} />
            </CardIcon>
            <StyledPriceLabel>{`${getDisplayBalance(totalEarnings, 18, 2)} ${bank.earnTokenName}`} </StyledPriceLabel>
            <DescribePriceLabel></DescribePriceLabel>
            {bank.accelerator ? (
              <DetailStyledPriceContainer>
                <DetailDescribePriceLabel>{`${bank.depositTokenName} Earnings`}</DetailDescribePriceLabel>
                <DetailStyledPriceLabel>{getDisplayBalance(tokenEarnings, 18, 2)}</DetailStyledPriceLabel>
              </DetailStyledPriceContainer>
            ) : (<div></div>)}
            {bank.accelerator ? (
              <DetailStyledPriceContainer>
                <DetailDescribePriceLabel>{`${bank.acceleratorTokenName} Earnings`}</DetailDescribePriceLabel>
                <DetailStyledPriceLabel>{getDisplayBalance(acceleratorEarnings, 18, 2)}</DetailStyledPriceLabel>
              </DetailStyledPriceContainer>
            ) : (<div></div>)}
            {bank.accelerator ? (
              <DetailStyledPriceContainer>
                <DetailDescribePriceLabel>{`Accelerator Speed`}</DetailDescribePriceLabel>
                <DetailStyledPriceLabel>{getDisplayAcceleratePercent(acceleratorEarnings, tokenEarnings)}</DetailStyledPriceLabel>
              </DetailStyledPriceContainer>
            ) : (<div></div>)}
          </StyledCardHeader>
          <StyledCardActions>
            <Button size="sm" onClick={onReward} disabled={totalEarnings.eq(0)} text="Settle" />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledPriceLabel = styled.div`
  height: 38px;
  font-size: 32px;
  font-family: Rubik-Bold, Rubik;
  font-weight: bold;
  color: #313A5A;
  line-height: 38px;
  text-align: center;
`;

const DescribePriceLabel = styled.div`
  height: 28px;
  font-size: 16px;
  font-family: Rubik-Regular,Rubik;
  font-weight: 400;
  color: #313A5A;
  line-height: 28px;
  text-align: center;
`;

const DetailStyledPriceContainer = styled.div`
  height: 38px;
  width:100%;
  display:block;
`;

const DetailDescribePriceLabel = styled.div`
  height:100%;
  width:160px;
  font-size: 16px;
  font-family: Rubik-Regular,Rubik;
  font-weight: 400;
  color: #313A5A;
  line-height: 38px;
  text-align: left;
  display: inline-block;
`;

const DetailStyledPriceLabel = styled.div`
  font-size: 18px;
  font-family: Rubik-Bold, Rubik;
  font-weight: bold;
  color: #313A5A;
  line-height: 38px;
  display: inline-block;
  float:right;
`;



const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
