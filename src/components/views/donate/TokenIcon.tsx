import { FC, useState } from 'react';
import Image from 'next/image';

interface IImageIconProps {
	symbol: string;
	size?: number;
	isSuperToken?: boolean;
}

export const TokenIcon: FC<IImageIconProps> = ({
	symbol,
	size = 24,
	isSuperToken,
}) => {
	const _symbol = symbol?.toUpperCase();
	let superTokenSymbol = _symbol.slice(0, -1); // From start to one before the last character
	const [src, setSrc] = useState(
		`/images/tokens/${isSuperToken ? superTokenSymbol : _symbol}.svg`,
	);
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
