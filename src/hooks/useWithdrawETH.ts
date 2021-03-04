import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import { Bank } from '../basis-cash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useWithdrawETH = (bank: Bank) => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdrawETH = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, 18);
      handleTransactionReceipt(
        basisCash.unstakeETH(bank.contract, amountBn),
        `Withdraw ${amount} ${bank.depositTokenName} from ${bank.contract}`,
      );
    },
    [bank, basisCash],
  );
  return { onWithdrawETH: handleWithdrawETH };
};

export default useWithdrawETH;
