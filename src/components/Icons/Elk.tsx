import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconElk: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/elk/${size}.svg`}
			alt='Honeyswap'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
