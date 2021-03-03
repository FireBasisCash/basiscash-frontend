import React from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  // icon: React.ReactNode,
  icon?: string,
  subtitle?: string,
  title?: string,
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, subtitle, title }) => {
  return (
    <StyledPageHeader>
      {icon?<StyledImg src={icon}></StyledImg>:<div></div>}
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </StyledPageHeader>
  )
}

const StyledPageHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: ${props => props.theme.spacing[6]}px;
  padding-top: ${props => props.theme.spacing[6]}px;
  max-width: 512px;
  width: 100%;
  margin: 0 auto;
`

const StyledImg = styled.img`
  width: 50%;
  max-width: 375px;
`

const StyledTitle = styled.h1`
  color: ${props => props.theme.color.grey[100]};
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${props => props.theme.color.grey[400]};
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default PageHeader