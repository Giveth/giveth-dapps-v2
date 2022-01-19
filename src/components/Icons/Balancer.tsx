import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconBalancer: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/balancer/${size}.svg`}
			alt='balancer'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
