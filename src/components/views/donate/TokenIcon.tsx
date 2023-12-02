import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

interface IImageIconProps {
	symbol: string;
	size?: number;
}

export const TokenIcon: FC<IImageIconProps> = ({ symbol, size = 24 }) => {
	const [src, setSrc] = useState(`/images/tokens/UNKOWN.svg`);
	useEffect(() => {
		setSrc(`/images/tokens/${symbol}.svg`);
	}, [symbol]);
	return (
		<Image
			alt={symbol}
			src={src}
			width={size}
			height={size}
			onError={() => setSrc('/images/tokens/UNKOWN.svg')}
		/>
	);
};
