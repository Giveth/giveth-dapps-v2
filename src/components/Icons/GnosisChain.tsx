import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconGnosisChain: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/gnosisChain/${size}.svg`}
			alt='GIV'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};
