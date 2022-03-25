import config from '@/configuration';
import { formatWeiHelper, Zero } from '@/helpers/number';
import {
	brandColors,
	Caption,
	Lead,
	Overline,
	Title,
	P,
	IconGIVStream,
	IconHelp,
	Button,
} from '@giveth/ui-design-system';
import React, { FC, MouseEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IconGIV } from './Icons/GIV';
import { IconXDAI } from './Icons/XDAI';
import { Flex } from './styled-components/Flex';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { IconEthereum } from './Icons/Eth';
import { IconGnosisChain } from './Icons/GnosisChain';
import { WhatisGIVstreamModal } from '@/components/modals/WhatisGIVstream';
import { WrongNetworkInnerModal } from './modals/WrongNetwork';
import { usePrice } from '@/context/price.context';
interface IRewardCardProps {
	title?: string;
	liquidAmount: ethers.BigNumber;
	stream: BigNumber.Value;
	actionLabel?: string;
	actionCb?: MouseEventHandler<HTMLButtonElement>;
	subButtonLabel?: string;
	subButtonCb?: Function;
	network?: number;
	className?: string;
	wrongNetworkText: string;
	targetNetworks: number[];
	rewardTokenSymbol?: string;
	tokenPrice?: BigNumber;
}

export const RewardCard: FC<IRewardCardProps> = ({
	title = 'Your GIVstream Rewards',
	liquidAmount = ethers.constants.Zero,
	stream = Zero,
	actionLabel,
	actionCb,
	subButtonLabel,
	subButtonCb,
	network,
	className,
	wrongNetworkText,
	targetNetworks,
	rewardTokenSymbol = 'GIV',
	tokenPrice,
}) => {
	const [usdAmount, setUSDAmount] = useState('0');
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const { givPrice } = usePrice();
	useEffect(() => {
		const price = tokenPrice || givPrice;
		if (!price || price.isNaN()) return;

		const usd = (+ethers.utils.formatEther(
			price.times(liquidAmount.toString()).toFixed(0),
		)).toFixed(2);
		setUSDAmount(usd);
	}, [liquidAmount, givPrice, tokenPrice]);

	return (
		<>
			<RewadCardContainer className={className}>
				{!network || !targetNetworks.includes(network) ? (
					<WrongNetworkInnerModal
						targetNetworks={targetNetworks}
						text={wrongNetworkText}
					/>
				) : (
					<>
						<CardHeader justifyContent='space-between'>
							<CardTitle>{title}</CardTitle>
							<ChainInfo alignItems='center'>
								{network === config.MAINNET_NETWORK_NUMBER && (
									<IconEthereum size={16} />
								)}
								{network === config.XDAI_NETWORK_NUMBER && (
									<IconGnosisChain size={16} />
								)}
								<ChainName styleType='Small'>
									{network === config.MAINNET_NETWORK_NUMBER
										? 'ETH'
										: 'GNO'}
								</ChainName>
							</ChainInfo>
						</CardHeader>
						<AmountInfo alignItems='center' gap='8px'>
							<IconGIV size={32} />
							<Title>{formatWeiHelper(liquidAmount)}</Title>
							<AmountUnit>{rewardTokenSymbol}</AmountUnit>
						</AmountInfo>
						<Converted>~${usdAmount}</Converted>
						<RateInfo alignItems='center' gap='8px'>
							<IconGIVStream size={24} />
							<P>{formatWeiHelper(stream)}</P>
							<RateUnit>{rewardTokenSymbol}/week</RateUnit>
							<IconHelpWraper
								onClick={() => {
									setShowWhatIsGIVstreamModal(true);
								}}
							>
								<IconHelp
									size={24}
									color={brandColors.deep[200]}
								/>
							</IconHelpWraper>
						</RateInfo>
						{actionLabel && actionCb ? (
							<ActionButton
								label={actionLabel}
								onClick={actionCb}
								buttonType='primary'
								disabled={liquidAmount.isZero()}
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
			</RewadCardContainer>
			{showWhatIsGIVstreamModal && (
				<WhatisGIVstreamModal
					showModal={showWhatIsGIVstreamModal}
					setShowModal={setShowWhatIsGIVstreamModal}
				/>
			)}
		</>
	);
};

const RewadCardContainer = styled.div`
	position: relative;
	background-color: ${brandColors.giv[700]};
	padding: 24px 24px;
	box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.15);
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

const IconHelpWraper = styled.div`
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
