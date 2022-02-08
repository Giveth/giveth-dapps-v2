import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

interface IXDaiIconProps extends ICurrencyIconProps {
	fill?: boolean;
}

export const IconXDAI: FC<IXDaiIconProps> = ({ size = 16, fill = true }) => {
	return (
		<Image
			src={`/images/currencies/xdai/${size}${fill ? '' : 'o'}.svg`}
			alt='xDai'
			width={fill ? size : (3 * size) / 4}
			height={fill ? size : (3 * size) / 4}
			loading='lazy'
		/>
	);
};
