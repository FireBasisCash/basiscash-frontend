import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import ERC20 from '../basis-cash/ERC20';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWhitelist = () => {
  const [joined, setJoined] = useState<Boolean>(false);
  const { account } = useWallet();
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const checkJoined = useCallback(async () => {
    const isJoined = await basisCash.checkWhitelistJoined();
    debugger
    setJoined(isJoined)
  }, [account]);

  const doJoin = useCallback(
    () => {
      handleTransactionReceipt(
        basisCash.joinWhitelist(),
        `Join Whitelist`,
      );
    },
    [account, basisCash],
  );
  useEffect(() => {
    if (account) {
      checkJoined().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account]);

  return { joined, joinWhitelist: doJoin };
};

export default useWhitelist;
