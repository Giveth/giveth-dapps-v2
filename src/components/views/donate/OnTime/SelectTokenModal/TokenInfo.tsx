import { Caption, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState, type FC } from 'react';
import { formatUnits, zeroAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { limitFraction } from '@/helpers/number';
import { TokenIconWithGIVBack } from '../../TokenIcon/TokenIconWithGIVBack';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ITokenInfoProps {
	token: IProjectAcceptedToken;
	onClick: () => void;
}

export const TokenInfo: FC<ITokenInfoProps> = ({ token, onClick }) => {
	const [visible, setVisible] = useState(false);
	const { address } = useAccount();
	const onVisible = () => {
		if (!visible) setVisible(true);
	};
	const ref = useIntersectionObserver(onVisible, {
		threshold: 0.1,
	});
	const { data: balance } = useBalance({
		token: token?.address === zeroAddress ? undefined : token?.address,
		address: address,
		query: {
			enabled: visible,
		},
	});
	const disable = balance?.value === 0n;

	return (
		<Wrapper
			gap='16px'
			$alignItems='center'
			$disabled={disable}
			onClick={() => {
				if (disable) return;
				onClick();
			}}
			ref={ref}
		>
			<TokenIconWithGIVBack
				showGiveBack
				symbol={token.symbol}
				size={32}
			/>
			<InfoWrapper $flexDirection='column' $alignItems='flex-start'>
				<TopRow $justifyContent='space-between'>
					<Flex gap='4px'>
						<Caption $medium>{token.symbol}</Caption>
						<GrayCaption>{token.name}</GrayCaption>
					</Flex>
					<Balance gap='4px'>
						<Caption $medium>
							{balance !== undefined
								? limitFraction(
										formatUnits(
											balance.value,
											token.decimals,
										),
										6,
									)
								: '--'}
						</Caption>
					</Balance>
				</TopRow>
			</InfoWrapper>
		</Wrapper>
	);
};

interface IWrapper {
	$disabled?: boolean;
}

const Wrapper = styled(Flex)<IWrapper>`
	padding: 4px 8px;
	cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
	&:hover {
		background: ${neutralColors.gray[200]};
	}
	border-radius: 8px;
`;

const InfoWrapper = styled(Flex)`
	flex: 1;
`;

const TopRow = styled(Flex)`
	width: 100%;
`;

const Balance = styled(Flex)`
	padding: 2px 8px;
	border-radius: 8px;
	background: ${neutralColors.gray[300]};
	align-items: flex-start;
	gap: 8px;
`;

const GrayCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;
