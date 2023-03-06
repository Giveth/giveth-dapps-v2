import React from 'react';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconPolygon } from '@/components/Icons/Polygon';

const NetworkLogo = (props: { chainId?: number; logoSize?: number }) => {
	const { chainId, logoSize } = props;
	if (chainId === 1 || chainId === 5) {
		return <IconEthereum size={logoSize} />;
	} else if (chainId === 100) {
		return <IconGnosisChain size={logoSize} />;
	} else if (chainId === 137) {
		return <IconPolygon size={logoSize} />;
	} else return null;
};

export default NetworkLogo;
