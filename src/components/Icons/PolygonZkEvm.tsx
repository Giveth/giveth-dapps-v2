import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconPolygonZkEvm: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src='/images/currencies/polygon-zkevm/16.svg'
			alt='polygon'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
