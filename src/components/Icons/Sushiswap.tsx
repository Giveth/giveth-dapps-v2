import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconSushiswap: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/sushiswap/sushiswap.svg`}
			alt='uniswap'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
