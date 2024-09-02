import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

const IconStellar: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={'/images/tokens/XLM.svg'}
			alt='Solana icon'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};

export default IconStellar;
