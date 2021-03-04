import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../basis-cash';
import useEthBalance from '../../../hooks/useEthBalance';
import useStakeETH from '../../../hooks/useStakeETH';
import useWithdrawETH from '../../../hooks/useWithdrawETH';

interface StakeProps {
  bank: Bank;
}

const Stake: React.FC<StakeProps> = ({ bank }) => {
  // TODO: reactive update of token balance
  const ethBalance = useEthBalance();
  const stakedBalance = useStakedBalance(bank.contract);

  const { onStakeETH } = useStakeETH(bank);
  const { onWithdrawETH } = useWithdrawETH(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={ethBalance}
      decimals={18}
      onConfirm={(amount) => {
        onStakeETH(amount);
        onDismissDeposit();
      }}
      tokenName={"HT"}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={18}
      onConfirm={(amount) => {
        onWithdrawETH(amount);
        onDismissWithdraw();
      }}
      tokenName={"HT"}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="HT" size={54} />
            </CardIcon>
            <Value value={getDisplayBalance(stakedBalance, 18)} />
            <Label text={`HT Staked`} />
          </StyledCardHeader>
          <StyledCardActions>
            <>
              <IconButton onClick={onPresentWithdraw}>
                <RemoveIcon />
              </IconButton>
              <StyledActionSpacer />
              {/*
                TODO add finisher
                <IconButton
                  disabled={bank.finished}
                  onClick={() => (bank.finished ? null : onPresentDeposit())}
                >
                  <AddIcon />
                </IconButton> */}
              <IconButton
                // disabled={bank.finished}
                onClick={onPresentDeposit}
              >
                <AddIcon />
              </IconButton>
            </>
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

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

const StyledActionSpacer = styled.div`
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

export default Stake;
