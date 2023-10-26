import { FC, useState } from 'react';
import Image from 'next/image';

interface IImageIconProps {
	symbol: string;
}

export const TokenIcon: FC<IImageIconProps> = ({ symbol }) => {
	const [src, setSrc] = useState(
		`/images/tokens/${symbol?.toUpperCase()}.svg`,
	);
	return (
		<Image
			alt={symbol}
			src={src}
			width='24'
			height='24'
			onError={() => setSrc('/images/tokens/UNKOWN.svg')}
		/>
	);
};
