import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Bank from '../Bank';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';

import imgBank from '../../assets/img/img_bank.png';
import useWhitelist from '../../hooks/useWhitelist';

const WhiteList: React.FC = () => {
  const { joined, joinWhitelist } = useWhitelist();
  const { account, connect } = useWallet();

  let title = "Whitelist";
  let subTitle = "Join FireBasisCash Whitelist and get FBC airdrop ";

  return (
    <Switch>
      <Page>
        <PageHeader
          icon={imgBank}
          title={title}
          subtitle={subTitle}
        />
        <Center>
          {!!account ? (
            joined ? <StyledText>You have joined whitelist already</StyledText> : <Button onClick={joinWhitelist} text="Join Whitelist" />
          ) : (
              <Center>
                <Button onClick={() => connect('injected')} text="Unlock Wallet" />
              </Center>
            )}



        </Center>
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
`

export default WhiteList;
