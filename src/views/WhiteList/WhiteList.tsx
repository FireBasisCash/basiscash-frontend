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
import { white } from '../../theme/colors';

const WhiteList: React.FC = () => {
  const { joined, joinWhitelist } = useWhitelist();
  const { account, connect } = useWallet();

  let title = "Whitelist";
  let subTitle = 
  "We are about to start the genesis mining, and the whitelisting activity are currently underway. If you want to join our whitelist, please submit your Heco address (non-ERC20 address). " +
  "Downloading and creating an address from Huobi Wallet site http://www.huobiwallet.com. Especially, the earliest 100 submitters will receive certain rewards. Thank you!";

  return (
    <Switch>
      <Page>
        <PageHeader
          icon={imgBank}
          title={title}
        />
        <StyleSubtitle>
            We are starting the <b style={{color:"#1FDB84"}}>genesis mining</b>, and the whitelisting activity are currently underway. Submitting your <b style={{color:"#1FDB84"}}>Heco Address</b>(non-ERC20 address) to join whitelist.<br/>
            The earliest <b style={{color:"#1FDB84"}}>100 submitters</b> will specially receive certain rewards. <br/>
            Downloading and creating an address from <b style={{color:"#1FDB84"}}>Huobi Wallet</b> site <a target="_blank" style={{color:white}} href="http://www.huobiwallet.com">http://www.huobiwallet.com</a>. <br/>
            Everyone is welcome. Regards.🏄
        </StyleSubtitle>
        <Center>
          <StyledText>
            
          </StyledText>
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

export default WhiteList;
