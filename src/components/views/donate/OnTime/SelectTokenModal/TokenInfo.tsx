import {
	Caption,
	neutralColors,
	Flex,
	IconCheckCircleFilled16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState, type FC } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';
import { useBalance } from 'wagmi';
import { limitFraction } from '@/helpers/number';
import { TokenIconWithGIVBack } from '../../TokenIcon/TokenIconWithGIVBack';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { ChainType } from '@/types/config';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { useDonateData } from '@/context/donate.context';

interface ITokenInfoProps {
	token: IProjectAcceptedToken;
	hideZeroBalance: boolean;
	onClick: () => void;
}

export const TokenInfo: FC<ITokenInfoProps> = ({
	token,
	hideZeroBalance,
	onClick,
}) => {
	const [visible, setVisible] = useState(false);
	const { selectedOneTimeToken } = useDonateData();
	const { walletAddress: address } = useGeneralWallet();
	const onVisible = () => {
		if (!visible) setVisible(true);
	};
	const ref = useIntersectionObserver(onVisible, {
		threshold: 0.1,
	});

	const isEvm = token.chainType === ChainType.EVM;
	const { data: evmBalance } = useBalance({
		token: token?.address === zeroAddress ? undefined : token?.address,
		address: (address as Address) || undefined,
		query: {
			enabled: isEvm && visible,
		},
	});

	const { data: solanaBalance } = useSolanaBalance({
		token: token?.address,
		address: !isEvm && visible ? address || undefined : undefined,
	});

	const balance = isEvm ? evmBalance?.value : solanaBalance;

	const disable = balance === 0n;
	const isSelected =
		selectedOneTimeToken?.address.toLowerCase() ===
		token.address.toLowerCase();

	if (hideZeroBalance && disable) return;
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
				showGiveBack={token.isGivbackEligible}
				symbol={token.symbol}
				size={32}
			/>
			<InfoWrapper $flexDirection='column' $alignItems='flex-start'>
				<TopRow $justifyContent='space-between'>
					<Flex gap='4px'>
						<Caption $medium>{token.symbol}</Caption>
						<GrayCaption>{token.name}</GrayCaption>
					</Flex>
					<Flex gap='4px' $alignItems='center'>
						<Balance>
							<Caption $medium>
								{balance !== undefined
									? limitFraction(
											formatUnits(
												balance,
												token.decimals,
											),
											token.decimals / 3,
										)
									: '--'}
							</Caption>
						</Balance>
						{isSelected && <IconCheckCircleFilled16 />}
					</Flex>
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
