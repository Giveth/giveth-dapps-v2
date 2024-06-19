import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

const IconBase: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={'/images/currencies/zkevm/16.svg'}
			alt='Base icon'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};

export default IconBase;
