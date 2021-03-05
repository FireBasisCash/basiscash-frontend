import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

interface LabelProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'normal';
  color?: string;
  align?: string;
}

const Label: React.FC<LabelProps> = ({ text, variant = 'secondary', color: customColor, align }) => {
  const { color } = useContext(ThemeContext);

  let labelColor: string;
  if (customColor) {
    labelColor = customColor;
  } else {
    if (variant === 'primary') {
      labelColor = color.primary.main;

    } else if (variant === 'secondary') {
      labelColor = color.secondary.main;

    } else if (variant === 'normal') {
      labelColor = color.grey[300];
    }
  }
  return (
    <StyledLabel color={labelColor} align={align} >{text}</StyledLabel>
  );
}

interface StyledLabelProps {
  color: string;
  align: string;
}

const StyledLabel = styled.div<StyledLabelProps>`
  color: ${props => props.color};
  text-align: ${props => props.align};
`

export default Label