import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconEthereum: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/eth/${size}.svg`}
			alt='Ethereum'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
