import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../basis-cash/ERC20';
import useBasisCash from './useBasisCash';
import config from '../config';

const useEthBalance = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchBalance = useCallback(async () => {
    basisCash.provider.getBalance(basisCash.myAccount).then((balance) => {
      // // 余额是 BigNumber (in wei); 格式化为 ether 字符串
      // let etherString = ethers.utils.formatEther(balance);

      // console.log("Balance: " + etherString);
      setBalance(balance);
    });

  }, [basisCash?.isUnlocked]);

  useEffect(() => {
    if (basisCash?.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(`Failed to fetch token balance: ${err.stack}`),
      );
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [basisCash?.isUnlocked]);

  return balance;
};

export default useEthBalance;
