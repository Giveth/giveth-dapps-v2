import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconHoneyswap: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/honeyswap/${size}.svg`}
			alt='Honeyswap'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
