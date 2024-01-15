import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconUnknown: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/unknown/32.svg`}
			alt='Unknown'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
