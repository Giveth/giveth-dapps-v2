import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconClassic: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/classic/32.svg`}
			alt='Classic'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
