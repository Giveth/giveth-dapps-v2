import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconAngelVault: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/angelvault/${size}.svg`}
			alt='balancer'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
