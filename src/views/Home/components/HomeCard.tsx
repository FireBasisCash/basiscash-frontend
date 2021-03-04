import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import Label from '../../../components/Label';
import { TokenStat } from '../../../basis-cash/types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import TokenSymbol from '../../../components/TokenSymbol';
import { commify } from 'ethers/lib/utils';
import config from '../../../config';

interface HomeCardProps {
  title: string;
  symbol: string;
  color: string;
  supplyLabel?: string;
  address: string;
  stat?: TokenStat;
}

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  symbol,
  color,
  address,
  supplyLabel = 'Total Supply',
  stat,
}) => {
  const tokenUrl = `${config.etherscanUrl}/token/${address}`;
  return (
    <Wrapper>
      <StyledCards>
        <CardHeader>{title}</CardHeader>
        <TokenSymbol symbol={symbol} />
        <CardText>
          <CardSection>
            <Label text="Current Price" color={color} />
            {stat ? (
              <StyledValue>{(stat.priceInUsdt !== '-' ? '$' : '') + stat.priceInUsdt}</StyledValue>
            ) : (
              <ValueSkeleton />
            )}
          </CardSection>

          <CardSection>
            <StyledSupplyLabel href={tokenUrl} target="_blank" color={color}>{supplyLabel}</StyledSupplyLabel>
            {stat ? <StyledValue>{commify(stat.totalSupply)}</StyledValue> : <ValueSkeleton />}
          </CardSection>
        </CardText>
      </StyledCards>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @media (max-width: 768px) {
    margin-top: ${(props) => props.theme.spacing[4]}px;
  }
`;

const CardHeader = styled.h2`
  height: 22px;
  font-size: 18px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 700;
  color: #031D5B;
  line-height: 22px;
`;

const StyledCards = styled.div`
  position:relative;
  min-width: 200px;
  padding: ${(props) => props.theme.spacing[3]}px;
  color: ${(props) => props.theme.color.white};
  background-color: #ffffff;
  border-radius: 5px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledValue = styled.span`
  display: inline-block;
  font-size: 24px;
  color: #5B6C94;
  font-weight: bold;
`;

const CardText = styled.div`
  margin-left: 80px;
`;

const CardSection = styled.div`
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ValueSkeletonPadding = styled.div`
  padding-top: ${(props) => props.theme.spacing[3]}px;
  padding-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledSupplyLabel = styled.a`
  display: block;
  color: ${(props) => props.color};
`;

const ValueSkeleton = () => {
  const theme = useContext(ThemeContext);
  return (
    <SkeletonTheme color={theme.color.grey[700]} highlightColor={theme.color.grey[600]}>
      <ValueSkeletonPadding>
        <Skeleton height={10} />
      </ValueSkeletonPadding>
    </SkeletonTheme>
  );
};

const GuideText = styled.span`
  color: ${(props) => props.theme.color.primary.main};
  font-size: 0.8rem;
`;

const ValueText = styled.p`
  color: ${(props) => props.theme.color.white};
  font-weight: bold;
  font-size: 1.25rem;
  margin: ${(props) => props.theme.spacing[1]}px 0;
`;

export default HomeCard;
