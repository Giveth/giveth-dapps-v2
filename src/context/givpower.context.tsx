import { createContext, FC, ReactNode, useContext } from 'react';
import { Zero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { Zero as BNZero } from '@/helpers/number';
import { useStakingPool } from '@/hooks/useStakingPool';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import config from '@/configuration';

import type { IStakeInfo } from '@/hooks/useStakingPool';
import type { PoolStakingConfig } from '@/types/config';

interface IGIVpowerContext extends IStakeInfo {
	poolStakingConfig: PoolStakingConfig;
}

const givPoolstakingConfigGnosis = getGivStakingConfig(config.XDAI_CONFIG);
const givPoolstakingConfigMainnet = getGivStakingConfig(config.MAINNET_CONFIG);

const zeroAPR = {
	effectiveAPR: BNZero,
	vaultIRR: BNZero,
};

export const GIVpowerContext = createContext<IGIVpowerContext>({
	poolStakingConfig: givPoolstakingConfigGnosis,
	apr: zeroAPR,
	earned: Zero,
	stakedAmount: Zero,
	notStakedAmount: Zero,
});

GIVpowerContext.displayName = 'GIVpowerContext';

interface IGIVpowerProvider {
	children: ReactNode;
}

export const GIVpowerProvider: FC<IGIVpowerProvider> = ({ children }) => {
	const { chainId } = useWeb3React();
	const givPoolstakingConfig =
		chainId === config.XDAI_NETWORK_NUMBER
			? givPoolstakingConfigGnosis
			: givPoolstakingConfigMainnet;
	const { apr, notStakedAmount, stakedAmount, earned } = useStakingPool(
		givPoolstakingConfig,
		config.XDAI_NETWORK_NUMBER,
	);
	return (
		<GIVpowerContext.Provider
			value={{
				poolStakingConfig: givPoolstakingConfig,
				apr,
				notStakedAmount,
				stakedAmount,
				earned,
			}}
		>
			{children}
		</GIVpowerContext.Provider>
	);
};

export function useGIVpower() {
	const context = useContext(GIVpowerContext);

	if (!context) {
		throw new Error('GIVpower context not found!');
	}

	return context;
}
