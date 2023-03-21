import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconOptimism: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/optimism/16.svg`}
			alt='optimism'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
