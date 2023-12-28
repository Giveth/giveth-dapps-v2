import {
	brandColors,
	Caption,
	Lead,
	Overline,
	Title,
	P,
	IconGIVStream,
	Button,
	IconHelpFilled24,
} from '@giveth/ui-design-system';
import React, { FC, MouseEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IconGIV } from './Icons/GIV';
import { Flex } from './styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { WhatIsStreamModal } from '@/components/modals/WhatIsStream';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { useAppSelector } from '@/features/hooks';
import { WrongNetworkInnerModal } from '@/components//modals/WrongNetworkInnerModal';
import NetworkLogo from './NetworkLogo';
import { ScaleRate, ScaleRateBig } from '@/lib/constants/constants';
import { getChainName } from '@/lib/network';

interface IRewardCardProps {
	cardName: string;
	title: string;
	liquidAmount: bigint;
	stream: bigint;
	actionLabel?: string;
	actionCb?: MouseEventHandler<HTMLButtonElement>;
	subButtonLabel?: string;
	subButtonCb?: Function;
	network?: number;
	className?: string;
	targetNetworks: number[];
	rewardTokenSymbol?: string;
	tokenPrice?: bigint;
}

export const RewardCard: FC<IRewardCardProps> = ({
	cardName,
	title,
	liquidAmount = 0n,
	stream = 0n,
	actionLabel,
	actionCb,
	subButtonLabel,
	subButtonCb,
	network,
	className,
	targetNetworks,
	rewardTokenSymbol = 'GIV',
	tokenPrice,
}) => {
	const { formatMessage } = useIntl();
	const [usdAmount, setUSDAmount] = useState(0n);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const givPrice = useAppSelector(state => state.price.givPrice);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	useEffect(() => {
		const price =
			tokenPrice || BigInt((Number(givPrice) * ScaleRate).toFixed(0));
		if (!price) return;

		const usd = (price * liquidAmount) / ScaleRateBig;
		setUSDAmount(usd);
	}, [liquidAmount, givPrice, tokenPrice]);

	return (
		<>
			<RewardCardContainer className={className}>
				{!network || !targetNetworks.includes(network) ? (
					<WrongNetworkInnerModal
						targetNetworks={targetNetworks}
						cardName={cardName}
					/>
				) : (
					<>
						<CardHeader justifyContent='space-between' gap='4px'>
							<CardTitle>{title}</CardTitle>
							<ChainInfo alignItems='center'>
								<NetworkLogo chainId={network} logoSize={16} />
								<ChainName styleType='Small'>
									{getChainName(network)}
								</ChainName>
							</ChainInfo>
						</CardHeader>
						<AmountInfo alignItems='center' gap='8px'>
							<IconGIV size={32} />
							<Title>
								{formatWeiHelper(liquidAmount.toString())}
							</Title>
							<AmountUnit>{rewardTokenSymbol}</AmountUnit>
						</AmountInfo>
						<Converted>
							~${formatWeiHelper(usdAmount.toString())}
						</Converted>
						<RateInfo alignItems='center' gap='8px'>
							<IconGIVStream size={24} />
							<P>{formatWeiHelper(stream.toString())}</P>
							<RateUnit>
								{rewardTokenSymbol}
								{formatMessage({ id: 'label./week' })}
							</RateUnit>
							<IconHelpFilledWrapper
								onClick={() => {
									setShowWhatIsGIVstreamModal(true);
								}}
							>
								<IconHelpFilled24
									color={brandColors.deep[200]}
								/>
							</IconHelpFilledWrapper>
						</RateInfo>
						{actionLabel && actionCb ? (
							<ActionButton
								label={actionLabel}
								onClick={actionCb}
								buttonType='primary'
								disabled={liquidAmount === 0n}
							/>
						) : (
							<PlaceHolderButton />
						)}
						{subButtonLabel && (
							<StyledSubButton
								onClick={() => {
									if (subButtonCb) subButtonCb();
								}}
							>
								{subButtonLabel}
							</StyledSubButton>
						)}
					</>
				)}
			</RewardCardContainer>
			{showWhatIsGIVstreamModal && (
				<WhatIsStreamModal
					setShowModal={setShowWhatIsGIVstreamModal}
					tokenDistroHelper={givTokenDistroHelper}
				/>
			)}
		</>
	);
};

const RewardCardContainer = styled.div`
	position: relative;
	background-color: ${brandColors.giv[700]};
	padding: 24px 24px;
	box-shadow: 0 5px 16px rgba(0, 0, 0, 0.15);
`;

const CardHeader = styled(Flex)`
	color: ${brandColors.deep[100]};
	margin-bottom: 16px;
`;

const ChainInfo = styled(Flex)`
	gap: 4px;
`;

const ChainName = styled(Overline)``;

const CardTitle = styled(Caption)``;

const AmountInfo = styled(Flex)``;

const AmountUnit = styled(Lead)`
	color: ${brandColors.deep[100]};
`;

const Converted = styled(P)`
	color: ${brandColors.deep[200]};
	margin-left: 40px;
	margin-bottom: 22px;
`;

const RateInfo = styled(Flex)`
	margin-bottom: 12px;
`;

const RateUnit = styled(Lead)`
	color: ${brandColors.deep[100]};
`;

const ActionButton = styled(Button)`
	width: 100%;
`;

const IconHelpFilledWrapper = styled.div`
	cursor: pointer;
`;

const StyledSubButton = styled(Caption)`
	color: ${brandColors.giv[100]};
	cursor: pointer;
	margin: 8px 0;
	text-align: center;
`;

const PlaceHolderButton = styled.div`
	height: 40px;
`;
