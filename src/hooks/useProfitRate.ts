import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';
import { ContractName } from '../basis-cash';
import config from '../config';
import { Bank, PoolProfitRate } from '../basis-cash/types';

const useProfitRate = (bank:Bank) => {
  const [profitRate, setProfitRate] = useState<PoolProfitRate>();
  const basisCash = useBasisCash();

  const fetchProfit = useCallback(async () => {
    setProfitRate(await basisCash.getPoolProfit(bank));
  }, [basisCash?.isUnlocked, bank]);

  useEffect(() => {
    if (basisCash?.isUnlocked) {
      fetchProfit().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchProfit, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [basisCash?.isUnlocked, bank, basisCash]);

  return profitRate;
};

export default useProfitRate;
