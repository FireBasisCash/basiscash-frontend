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
      const summary = `Withdraw ${amount} ${bank.depositTokenName} from ${bank.contract}`;
      basisCash.unstakeETH(bank.contract, summary, amountBn)
    }, [bank, basisCash]
  );
  return { onWithdrawETH: handleWithdrawETH };
};

export default useWithdrawETH;
