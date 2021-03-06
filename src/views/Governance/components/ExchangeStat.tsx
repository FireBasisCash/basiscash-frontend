import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/Card';


interface ExchangeStatProps {
  tokenName: string;
  description: string;
  count: string;
}

export const GreenExchangeStat: React.FC<ExchangeStatProps> = ({ tokenName, description, count }) => {
  return (
    <Card>
      <StyledCardContentInner>
        <StyledCardTitle>{`${count} ${tokenName}`}</StyledCardTitle>
        <GreenStyledDesc>{description}</GreenStyledDesc>
      </StyledCardContentInner>
    </Card>
  );
};

export const RedExchangeStat: React.FC<ExchangeStatProps> = ({ tokenName, description, count }) => {
  return (
    <Card>
      <StyledCardContentInner>
        <StyledCardTitle>{`${count} ${tokenName}`}</StyledCardTitle>
        <RedStyledDesc>{description}</RedStyledDesc>
      </StyledCardContentInner>
    </Card>
  );
};


const StyledCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px ${props => props.theme.color.grey[700]};
  border: 1px solid ${props => props.theme.color.grey[900]};
  display: flex;
  flex: 1;
  flex-direction: column;
`


const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.black[200]};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const RedStyledDesc = styled.span`
  color: red;
  text-align: center;
  font-weight:bold;
`;

const GreenStyledDesc = styled.span`
  color: #169057;
  text-align: center;
  font-weight:bold;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px;
`;
