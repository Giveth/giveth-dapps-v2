import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

const IconRobinhood: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/robinhood/${size}.svg`}
			alt='Robinhood Chain icon'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
};

export default IconRobinhood;
