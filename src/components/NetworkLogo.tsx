import { FC } from 'react';
import config from '@/configuration';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconPolygon } from '@/components/Icons/Polygon';
import { IconCelo } from './Icons/Celo';
import { IconOptimism } from './Icons/Optimism';

interface INetworkLogo {
	chainId?: number;
	logoSize?: number;
}

const NetworkLogo: FC<INetworkLogo> = ({ chainId, logoSize }) => {
	if (chainId === parseInt(config.MAINNET_CONFIG.chainId)) {
		return <IconEthereum size={logoSize} />;
	} else if (chainId === parseInt(config.XDAI_CONFIG.chainId)) {
		return <IconGnosisChain size={logoSize} />;
	} else if (chainId === parseInt(config.POLYGON_CONFIG.chainId)) {
		return <IconPolygon size={logoSize} />;
	} else if (chainId === parseInt(config.OPTIMISM_CONFIG.chainId)) {
		return <IconOptimism size={logoSize} />;
	} else if (chainId === parseInt(config.CELO_CONFIG.chainId)) {
		return <IconCelo size={logoSize} />;
	} else return null;
};

export default NetworkLogo;
