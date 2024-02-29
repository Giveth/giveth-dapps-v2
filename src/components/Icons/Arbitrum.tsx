import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

const IconArbitrum: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={'/images/tokens/ARB.svg'}
			alt='Solana icon'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};

export default IconArbitrum;
