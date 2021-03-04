import React from 'react'
import styled from 'styled-components'

interface ModalTitleProps {
  text?: string
}

const ModalTitle: React.FC<ModalTitleProps> = ({ text }) => (
  <StyledModalTitle>
    {text}
  </StyledModalTitle>
)

const StyledModalTitle = styled.span`
  text-align: center;
  text-overflow: ellipsis;
  white-space: break-spaces;
  overflow: hidden;
  color: #031D5B;
  display: block;
  font-size: 18px;
  font-weight: 700;
  height: ${props => props.theme.topBarSize}px;
  line-height: ${props => props.theme.topBarSize}px;
  margin-top: ${props => -props.theme.spacing[4]}px;
`

export default ModalTitle