import React from 'react';

import fbcLogo from '../../assets/img/fbc.svg';
import fbsLogo from '../../assets/img/fbs.svg';
import fbbLogo from '../../assets/img/fbb.svg';
import fbgLogo from '../../assets/img/fbg.svg';
import usdtLogo from '../../assets/img/USDT.png';
import HTLogo from '../../assets/img/HT.png';

const logosBySymbol: {[title: string]: string} = {

  'FBC': fbcLogo,
  'FBB': fbbLogo,
  'FBS': fbsLogo,
  'FBG': fbgLogo,
  "USDT": usdtLogo,
  'HT': HTLogo,

  'FBC_USDT_LP': fbsLogo,
  'FBS_USDT_LP': fbsLogo,
  'FBG_USDT_LP': fbsLogo,

};

type BasisLogoProps = {
  symbol: string;
  size?: number;
}

const TokenSymbol: React.FC<BasisLogoProps> = ({ symbol, size = 36 }) => {
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
