import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href= {buyFBC} target="_blank">Get FBC</StyledLink>
      <StyledLink href= {buyFBS} target="_blank">Get FBS</StyledLink>
      <StyledLink href="http://github.com/firebasiscash" target="_blank">GitHub</StyledLink>
      <StyledLink href="https://t.me/hecofire" target="_blank">Telegram</StyledLink>
      <StyledLink href="https://firebasis.medium.com" target="_blank">Medium</StyledLink>
      <StyledLink href="https://github.com/FireBasisCash/basiscash-protocol/wiki" target="_blank">Source</StyledLink>
      {/* <StyledLink href="https://github.com/FireBasisCash/basiscash-protocol/wiki" target="_blank">Audit</StyledLink> */}
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  max-width: 100%;
  display: block;
  text-align: center;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  display: inline-block;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`
const buyFBS ="https://uniswap.exchange/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0xa7ed29b253d8b4e3109ce07c80fc570f81b63696";
const buyFBC= "https://uniswap.exchange/swap?inputCurrency=0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f"
export default Nav