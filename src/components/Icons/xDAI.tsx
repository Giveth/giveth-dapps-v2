import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconxDAI: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/xdai/${size}.svg`}
			alt='honeyswap'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
