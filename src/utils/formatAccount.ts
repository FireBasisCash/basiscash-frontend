import { BigNumber } from 'ethers';

export const formatAccount = (account: string) => {
  return account.slice(0, 6) + '...' + account.slice(-4)

};

