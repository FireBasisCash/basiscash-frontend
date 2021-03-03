import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import { Bank } from '../basis-cash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useAcceleratorStake = (bank: Bank) => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.acceleratorToken.decimal);
      handleTransactionReceipt(
        basisCash.acceleratorStake(bank.contract, amountBn),
        `Stake ${amount} ${bank.acceleratorTokenName} to ${bank.contract}`,
      );
    },
    [bank, basisCash],
  );
  return { onStake: handleStake };
};

export default useAcceleratorStake;
