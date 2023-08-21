import config from '@/configuration';

const networkIds = Object.keys(config.NETWORKS_CONFIG).map(Number);

const NetworkLogo = (props: { chainId?: number; logoSize?: number }) => {
	const { chainId, logoSize } = props;
	if (chainId && networkIds.includes(chainId)) {
		return config.NETWORKS_CONFIG[chainId].chainLogo(logoSize);
	} else return null;
};

export default NetworkLogo;
