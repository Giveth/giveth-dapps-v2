import { FC, Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import Image from 'next/image';
import {
	IconExternalLink,
	neutralColors,
	brandColors,
	Button,
	Overline,
	B,
	IconGiveth,
	IconETH,
	semanticColors,
	Subline,
	P,
} from '@giveth/ui-design-system';

import { LiquidityPosition } from '@/types/nfts';
import { Row } from '@/components/styled-components/Grid';
import { IconWithTooltip } from '../IconWithToolTip';
import LoadingAnimation from '@/animations/loading.json';
import { Pending } from '../modals/HarvestAll.sc';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const LoadingButtonContainer = styled.span`
	display: flex;
	place-items: center;
`;

const DummyDiv = styled.div`
	width: 24px;
`;

interface ILoadingButton {
	label: string;
}

const LoadingButton: FC<ILoadingButton> = ({ label }) => (
	<LoadingButtonContainer>
		<Lottie options={loadingAnimationOptions} height={24} width={24} />
		{label}
		<DummyDiv />
	</LoadingButtonContainer>
);
interface IV3StakeCardProps {
	position: LiquidityPosition;
	isUnstaking?: boolean;
	selectedPosition?: boolean;
	isConfirming?: boolean;
	handleAction: (tokenId: number) => void;
}

const STARTS_WITH = 'data:application/json;base64,';

const V3StakingCard: FC<IV3StakeCardProps> = ({
	position,
	isUnstaking,
	selectedPosition,
	isConfirming,
	handleAction,
}) => {
	const { pool, tickLower, tickUpper } = position._position || {};

	const buttonLabel = isUnstaking ? 'UNSTAKE & HARVEST' : 'STAKE';

	// Check price range
	const below =
		pool && typeof tickLower === 'number'
			? pool.tickCurrent < tickLower
			: undefined;
	const above =
		pool && typeof tickUpper === 'number'
			? pool.tickCurrent >= tickUpper
			: undefined;
	const inRange: boolean =
		typeof below === 'boolean' && typeof above === 'boolean'
			? !below && !above
			: false;

	const parseUri = (tokenURI: string) => {
		if (!tokenURI) return {};
		try {
			return JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
		} catch {
			return {};
		}
	};

	const { image } = parseUri(position.uri);

	return (
		<PositionContainer key={position.tokenId.toString()}>
			{image && (
				<ImageContainer>
					<Image
						src={image}
						width={72}
						height={124}
						alt='Liquidity Position NFT'
					/>
				</ImageContainer>
			)}
			<PositionInfo>
				<PositionInfoRow>
					<StyledOverline>LIQUIDITY</StyledOverline>
					<RoundedInfo>
						{position._position
							? position._position?.pool.fee / 10000
							: '-'}
						%
					</RoundedInfo>
					<RoundedInfo>
						{inRange ? (
							<>
								<GreenDot /> In Range
							</>
						) : (
							<IconWithTooltip
								icon={
									<>
										<YellowDot />
										Out of Range
									</>
								}
								direction={'top'}
							>
								<RangeTooltip>
									Your staked position is out of range and is
									not earning rewards.{' '}
									<PositionLink
										target='_blank'
										referrerPolicy='no-referrer'
										href={`https://app.uniswap.org/#/pool/${position.tokenId.toString()}`}
									>
										View position
									</PositionLink>{' '}
									for more details.
								</RangeTooltip>
							</IconWithTooltip>
						)}
					</RoundedInfo>
				</PositionInfoRow>
				<TokenAmountRow>
					<IconGiveth size={16} />
					<TokenValue>
						{position._position
							? position._position.amount0.toSignificant(4)
							: '-'}
					</TokenValue>
				</TokenAmountRow>
				<TokenAmountRow>
					<IconETH size={16} />
					<TokenValue>
						{position._position
							? position._position.amount1.toSignificant(4)
							: '-'}
					</TokenValue>
				</TokenAmountRow>
			</PositionInfo>
			<PositionActions>
				{isConfirming && selectedPosition ? (
					<PendingStyled>
						<Lottie
							options={loadingAnimationOptions}
							height={40}
							width={40}
						/>
						&nbsp;PENDING
					</PendingStyled>
				) : (
					<FullWidthButton
						label={buttonLabel}
						buttonType='primary'
						onClick={() => handleAction(position.tokenId)}
					/>
				)}
				<FullWidthButton
					label='VIEW POSITION'
					onClick={() =>
						window.open(
							`https://app.uniswap.org/#/pool/${position.tokenId.toString()}`,
						)
					}
					buttonType='texty'
					icon={
						<IconExternalLink
							size={16}
							color={brandColors.deep[100]}
						/>
					}
				/>
			</PositionActions>
		</PositionContainer>
	);
};

export const ImageContainer = styled.div`
	position: absolute;
	bottom: 16px;
`;

export const PositionContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	border-radius: 8px;
	padding: 12px 24px;
	background: ${brandColors.giv[400]};
	color: ${neutralColors.gray[100]};
`;

export const PositionInfo = styled.div`
	margin-left: 96px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	color: ${neutralColors.gray[100]};
`;

export const PositionInfoRow = styled(Row)`
	font-size: 12px;
	align-items: center;
	gap: 8px;
`;

export const TokenAmountRow = styled(Row)`
	align-items: center;
	gap: 4px;
`;

export const StyledOverline = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

const RoundedInfo = styled.div`
	background: ${brandColors.giv[600]};
	border-radius: 28px;
	font-weight: bold;
	padding: 4px 10px;
`;

export const TokenValue = styled(B)``;

export const PositionActions = styled.div`
	display: flex;
	width: 200px;
	flex-direction: column;
	gap: 12px;
`;

export const FullWidthButton = styled(Button)`
	width: 100%;
`;

export const SimpleDot = styled.div`
	display: inline-block;
	border-radius: 50%;
	height: 8px;
	width: 8px;
	margin-right: 4px;
`;

export const GreenDot = styled(SimpleDot)`
	background-color: ${semanticColors.jade[500]};
`;

export const YellowDot = styled(SimpleDot)`
	background-color: ${semanticColors.golden[500]};
`;

export const RangeTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 280px;
`;

export const PositionLink = styled.a`
	color: ${brandColors.cyan[500]};
`;

const PendingStyled = styled(Pending)`
	margin: 0 auto;
	max-width: 200px;
`;

export default V3StakingCard;
