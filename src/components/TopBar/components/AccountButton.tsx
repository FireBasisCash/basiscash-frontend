import React from 'react';
import styled from 'styled-components';

import { useWallet } from 'use-wallet';

import useModal from '../../../hooks/useModal';
import { formatAccount } from '../../../utils/formatAccount';

import Button from '../../Button';

import AccountModal from './AccountModal';

interface AccountButtonProps { }

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<AccountModal />)

  const { account, connect } = useWallet()

  return (
    <StyledAccountButton>
      {!account ? (
        <Button
          onClick={() => connect('injected')}
          size="sm"
          text="Unlock Wallet"
        />
      ) : (
          <Button
            onClick={onPresentAccountModal}
            size="sm"
            text={account ? formatAccount(account) : "My Wallet"}
          />
        )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AccountButton