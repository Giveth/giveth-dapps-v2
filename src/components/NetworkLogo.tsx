import config from '@/configuration';
import { ChainType } from '@/types/config';

const networkIds = Object.keys(config.EVM_NETWORKS_CONFIG).map(Number);

interface INetworkLogoProps {
	chainId?: number;
	logoSize?: number;
	chainType?: ChainType;
}

const NetworkLogo = (props: INetworkLogoProps) => {
	const { chainId, logoSize, chainType } = props;
	if (chainType && chainType !== ChainType.EVM) {
		return config.NON_EVM_NETWORKS_CONFIG[chainType].chainLogo(logoSize);
	}
	if (chainId && networkIds.includes(chainId)) {
		return config.EVM_NETWORKS_CONFIG[chainId].chainLogo(logoSize);
	}
	return null;
};

export default NetworkLogo;
