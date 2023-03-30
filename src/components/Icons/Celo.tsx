import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconCelo: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/celo/16.svg`}
			alt='Celo'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
