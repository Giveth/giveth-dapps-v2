import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconDai: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/dai/${size}.svg`}
			alt='uniswap'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
