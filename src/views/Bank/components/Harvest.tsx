import React from 'react';
import styled from 'styled-components';

import { Contract } from 'ethers';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

import { getDisplayBalance } from '../../../utils/formatBalance';
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

  const tokenName = bank.earnTokenName; // 'FBS' ? 'Share' : 'Cash'
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.earnToken.symbol} />
            </CardIcon>
            <StyledPriceLabel>{'$'+getDisplayBalance(totalEarnings, 18, 2)} </StyledPriceLabel>
            <DescribePriceLabel>{`Gross Earnings`}</DescribePriceLabel>
            {bank.accelerator?(
              <div>
                <StyledPriceLabel>{'$' + getDisplayBalance(tokenEarnings, 18, 2)}</StyledPriceLabel>
                <DescribePriceLabel>{`${tokenName} Income`}</DescribePriceLabel>
              </div>
            ):(<div></div>)}
            {bank.accelerator?(
              <div>
                <StyledPriceLabel>{'$' + getDisplayBalance(acceleratorEarnings, 18, 2)}</StyledPriceLabel>
                <DescribePriceLabel>{`Accelerated Income`}</DescribePriceLabel>
              </div>
            ):(<div></div>)}
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
