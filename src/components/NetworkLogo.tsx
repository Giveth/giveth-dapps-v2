import config from '@/configuration';
import { ChainType } from '@/types/config';

const networkIds = Object.keys(config.EVM_NETWORKS_CONFIG).map(Number);
const networkTypes = Object.keys(config.NON_EVM_NETWORKS_CONFIG);

interface INetworkLogoProps {
	chainId?: number;
	logoSize?: number;
	chainType?: ChainType;
}

const NetworkLogo = (props: INetworkLogoProps) => {
	const { chainId, logoSize, chainType } = props;
	if (
		(chainId && networkIds.includes(chainId)) ||
		(chainType && networkTypes.includes(chainType))
	) {
		return config.NETWORKS_CONFIG[
			chainType && chainType !== ChainType.EVM ? chainType : chainId!
		]?.chainLogo(logoSize);
	}
	return null;
};

export default NetworkLogo;
