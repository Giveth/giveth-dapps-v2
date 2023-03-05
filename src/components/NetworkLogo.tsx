import Image from 'next/image';
import React from 'react';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';

const NetworkLogo = (props: { chainId?: number; logoSize?: number }) => {
	const { chainId, logoSize } = props;
	if (chainId === 1) {
		return <IconEthereum size={logoSize} />;
	} else if (chainId === 100) {
		return <IconGnosisChain size={logoSize} />;
	} else if (chainId === 137) {
		return (
			<Image
				src='/images/currencies/polygon/16.svg'
				alt='Polygon'
				width={logoSize}
				height={logoSize}
				loading='lazy'
			/>
		);
	} else return null;
};

export default NetworkLogo;
