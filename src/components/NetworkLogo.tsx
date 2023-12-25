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
	if ((chainId && networkIds.includes(chainId)) || chainType) {
		return config.NETWORKS_CONFIG[(chainId || chainType)!].chainLogo(
			logoSize,
		);
	}
	return null;
};

export default NetworkLogo;
