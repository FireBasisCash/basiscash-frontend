import React from 'react';

import fbcLogo from '../../assets/img/fbc.svg';
import fbsLogo from '../../assets/img/fbs.svg';
import fbbLogo from '../../assets/img/fbb.svg';
import fbgLogo from '../../assets/img/fbg.svg';
import { relative } from 'path';

const logosBySymbol: {[title: string]: string} = {

  'FBC': fbcLogo,
  'FBB': fbbLogo,
  'FBS': fbsLogo,
  'FBG': fbgLogo,
  "USDT": fbcLogo,
  'FBC_USDT_LP': fbcLogo,
  'FBG_USDT_LP': fbcLogo,
  'FBS_USDT_LP': fbcLogo,
  'HT': fbcLogo,
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
    <div style={{width:66,height:66,position:'absolute',top:88,left:14}}>
      <div style={{background: '#1FDB84',borderRadius: 6,opacity: 0.1, position:'absolute', width:66, height:66,left:0,top:0}}></div>
      <img
        src={logosBySymbol[symbol]}
        alt={`${symbol} Logo`}
        width={size}
        height={size}
        style={{marginLeft:15,marginTop:15}}
      />
    </div>
  )
};

export default TokenSymbol;
