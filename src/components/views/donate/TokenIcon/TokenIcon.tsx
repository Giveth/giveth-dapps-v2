import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

export interface ITokenIconProps {
	symbol?: string;
	size?: number;
}

export const TokenIcon: FC<ITokenIconProps> = ({ symbol, size = 24 }) => {
	console.log({symbol});
	const [src, setSrc] = useState(`/images/tokens/UNKOWN.svg`);
	useEffect(() => {
		setSrc(`/images/tokens/${symbol}.svg`);
	}, [symbol]);
	return (
		<Image
			alt={symbol || 'unknown token'}
			src={src}
			width={size}
			height={size}
			onError={() => setSrc('/images/tokens/UNKOWN.svg')}
		/>
	);
};
