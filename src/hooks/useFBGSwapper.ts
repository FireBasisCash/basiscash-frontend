import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { FBGSwapperInfo, TokenStat } from '../basis-cash/types';
import config from '../config';
import { BigNumber } from 'ethers';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useFBGSwapper = () => {
  const [swapperInfo, setSwapperInfo] = useState<FBGSwapperInfo>();
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();



  const fetchSwapInfo = useCallback(async () => {
    setSwapperInfo(await basisCash.getFBGSwapperInfo());
  }, [basisCash]);


  const handleSwap = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, basisCash.FBG.decimal);
      handleTransactionReceipt(
        basisCash.swapFBG(amountBn),
        `Swap ${amount} FireBasisCash to FireBasisGovernance`,
      );
    },
    [basisCash],
  );

  useEffect(() => {
    if (basisCash?.isUnlocked) {
      fetchSwapInfo().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchSwapInfo, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [basisCash?.isUnlocked, basisCash]);

  return { swapperInfo, handleSwap };
};

export default useFBGSwapper;
