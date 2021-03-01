import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useBasisCash from '../../hooks/useBasisCash';
import { Bank } from '../../basis-cash';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const BasisCash = useBasisCash();

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!BasisCash.isUnlocked) continue;

        // only show pools staked by user
        const balance = await BasisCash.stakedBalanceOnBank(bankInfo.contract, BasisCash.myAccount);
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: BasisCash.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName == 'FBC' ? BasisCash.FBC : BasisCash.FBS,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
    console.log(banks)
  }, [BasisCash, BasisCash?.isUnlocked, setBanks]);

  useEffect(() => {
    if (BasisCash) {
      fetchPools()
        .catch(err => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [BasisCash, BasisCash?.isUnlocked, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
