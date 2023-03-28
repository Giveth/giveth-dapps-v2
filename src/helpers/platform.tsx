import React from 'react';
import { StakingPlatform } from '@/types/config';

import config from '@/configuration';
import { IconAngelVault } from '@/components/Icons/AngelVault';
import { IconBalancer } from '@/components/Icons/Balancer';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGIV } from '@/components/Icons/GIV';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconHoneyswap } from '@/components/Icons/Honeyswap';
import { IconSushiswap } from '@/components/Icons/Sushiswap';
import { IconUniswap } from '@/components/Icons/Uniswap';

export const getPoolIconWithName = (
	platform: StakingPlatform,
	poolNetwork?: number,
) => {
	switch (poolNetwork) {
		case config.MAINNET_NETWORK_NUMBER:
			return <IconEthereum size={16} />;
		case config.XDAI_NETWORK_NUMBER:
			return <IconGnosisChain size={16} />;
	}
	// if no number is set then it defaults to platform icon
	switch (platform) {
		case StakingPlatform.BALANCER:
			return <IconBalancer size={16} />;
		case StakingPlatform.GIVETH:
			return <IconGIV size={16} />;
		case StakingPlatform.HONEYSWAP:
			return <IconHoneyswap size={16} />;
		case StakingPlatform.UNISWAP:
			return <IconUniswap size={16} />;
		case StakingPlatform.SUSHISWAP:
			return <IconSushiswap size={16} />;
		case StakingPlatform.ICHI:
			return <IconAngelVault size={16} />;
		default:
			break;
	}
};
