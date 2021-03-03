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
import useTokenBalance from '../../../hooks/useTokenBalance';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../basis-cash';
import useAcceleratorStakedBalance from '../../../hooks/useAcceleratorStakedBalance';
import useAcceleratorStake from '../../../hooks/useAcceleratorStake';
import useAcceleratorWithdraw from '../../../hooks/useAcceleratorWithdraw';
import { parseUnits } from 'ethers/lib/utils';
import useBasisCash from '../../../hooks/useBasisCash';

interface AcceleratorProps {
  bank: Bank;
}

const Accelerator: React.FC<AcceleratorProps> = ({ bank }) => {

  const [approveStatus, approve] = useApprove(bank.acceleratorToken, bank.address);
  // TODO: reactive update of token balance
  const tokenBalance = useTokenBalance(bank.acceleratorToken);
  const stakedBalance = useAcceleratorStakedBalance(bank.contract);

  const { onStake } = useAcceleratorStake(bank);
  const { onWithdraw } = useAcceleratorWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.acceleratorToken.decimal}
      onConfirm={(amount) => {
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.acceleratorTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.acceleratorToken.decimal}
      onConfirm={(amount) => {
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.acceleratorTokenName}
    />,
  );


  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.acceleratorToken.symbol} size={54} />
            </CardIcon>
            <Value value={getDisplayBalance(stakedBalance, bank.acceleratorToken.decimal)} />
            <Label text={`${bank.acceleratorTokenName} Staked`} />
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={
                  approveStatus == ApprovalState.PENDING ||
                  approveStatus == ApprovalState.UNKNOWN
                }
                onClick={approve}
                text={`Approve ${bank.acceleratorTokenName}`}
              />
            ) : (
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
            )}
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

export default Accelerator;
