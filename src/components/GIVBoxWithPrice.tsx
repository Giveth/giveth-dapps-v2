import { formatWeiHelper } from '@/helpers/number';
import { ethers } from 'ethers';
import { FC } from 'react';
import {
	GIVBoxWithPriceContainer,
	GIVBoxWithPriceIcon,
	GIVBoxWithPriceAmount,
	GIVBoxWithPriceUSD,
} from './GIVBoxWithPrice.sc';

interface IGIVBoxWithPriceProps {
	amount: ethers.BigNumber;
	price?: string;
}

export const GIVBoxWithPrice: FC<IGIVBoxWithPriceProps> = ({
	amount,
	price,
}) => {
	return (
		<>
			<GIVBoxWithPriceContainer alignItems='center'>
				<GIVBoxWithPriceIcon size={40} />
				<GIVBoxWithPriceAmount>
					{formatWeiHelper(amount)}
				</GIVBoxWithPriceAmount>
				<GIVBoxWithPriceUSD>~${price}</GIVBoxWithPriceUSD>
			</GIVBoxWithPriceContainer>
		</>
	);
};
