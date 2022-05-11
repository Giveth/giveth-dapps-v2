import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconCult: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/cult/${size}.svg`}
			alt='cult'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
