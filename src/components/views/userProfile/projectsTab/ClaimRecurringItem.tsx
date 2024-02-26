import {
	B,
	P,
	brandColors,
	neutralColors,
	Flex,
} from '@giveth/ui-design-system';
import { utils } from 'ethers';
import styled from 'styled-components';
import { useEffect } from 'react';
import { limitFraction } from '@/helpers/number';
import { TokenIcon } from '../../donate/TokenIcon/TokenIcon';
import { ITokenWithBalance } from '@/hooks/useProjectClaimableDonations';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { IAllTokensUsd } from './ClaimRecurringDonationModal';

interface IClaimRecurringItem {
	tokenWithBalance: ITokenWithBalance;
	onSelectStream: (item: ITokenWithBalance) => void;
	setAllTokensUsd: (allTokensUsd: IAllTokensUsd) => void;
	allTokensUsd: IAllTokensUsd;
}

export const ClaimRecurringItem = ({
	tokenWithBalance,
	onSelectStream,
	setAllTokensUsd,
	allTokensUsd,
}: IClaimRecurringItem) => {
	const symbol = tokenWithBalance.token.underlyingToken?.symbol!;
	const price = useTokenPrice(tokenWithBalance.token);

	useEffect(() => {
		if (price !== undefined) {
			setAllTokensUsd({
				...allTokensUsd,
				[symbol]: price,
			});
		}
	}, [price]);

	return (
		<ItemContainer
			$justifyContent='space-between'
			$alignItems='center'
			key={tokenWithBalance.token.symbol}
		>
			<Flex $alignItems='center'>
				<TokenIcon
					symbol={tokenWithBalance.token.underlyingToken?.symbol!}
				/>
				&nbsp; &nbsp;
				<B>
					{`
                    ${limitFraction(
						utils.formatUnits(
							tokenWithBalance.balance,
							tokenWithBalance.token.decimals,
						),
						6,
					)} 
                    ${tokenWithBalance.token.underlyingToken?.symbol} ~
                    ${price ?? 0}
                    USD
                `}
				</B>
			</Flex>
			<ClaimButton onClick={() => onSelectStream(tokenWithBalance)}>
				Claim tokens
			</ClaimButton>
		</ItemContainer>
	);
};

const ItemContainer = styled(Flex)`
	padding: 8px;
	border-radius: 8px;
	&:hover {
		background-color: ${neutralColors.gray[300]};
	}
`;

const ClaimButton = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;
