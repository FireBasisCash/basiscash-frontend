import React from 'react';

import bacLogo from '../../assets/img/basis-cash-logo.svg';
import basLogo from '../../assets/img/basis-share-logo.svg';
import babLogo from '../../assets/img/basis-bond-logo.svg';

const logosBySymbol: {[title: string]: string} = {

  'FBC': bacLogo,
  'FBB': babLogo,
  'FBS': basLogo,
  'FBG': basLogo,
  'FBC_USDT_LP': bacLogo,
  'FBS_USDT_LP': basLogo,
};

type BasisLogoProps = {
  symbol: string;
  size?: number;
}

const TokenSymbol: React.FC<BasisLogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid BasisLogo symbol: ${symbol}`);
  }
  return (
    <img
      src={logosBySymbol[symbol]}
      alt={`${symbol} Logo`}
      width={size}
      height={size}
    />
  )
};

export default TokenSymbol;
