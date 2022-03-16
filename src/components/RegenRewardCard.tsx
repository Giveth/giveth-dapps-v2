import { usePrice } from '@/context/price.context';
import { formatWeiHelper } from '@/helpers/number';
import { RegenStreamConfig } from '@/types/config';
import {
	brandColors,
	Button,
	SemiTitle,
	Subline,
} from '@giveth/ui-design-system';
import { ethers } from 'ethers';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { HarvestAllModal } from './modals/HarvestAll';
import { getStreamIconWithType } from './RegenStream';
import { Flex } from './styled-components/Flex';

interface IRegenRewardCardProps {
	streamConfig: RegenStreamConfig;
	network: number;
	liquidAmount: ethers.BigNumber;
}

export const RegenRewardCard: FC<IRegenRewardCardProps> = ({
	streamConfig,
	network,
	liquidAmount = ethers.constants.Zero,
}) => {
	const [usdAmount, setUSDAmount] = useState('0');
	const [showModal, setShowModal] = useState(false);
	const { getTokenPrice } = usePrice();

	useEffect(() => {
		const price = getTokenPrice(
			streamConfig.tokenAddressOnUniswapV2,
			network,
		);
		if (!price || price.isNaN()) return;

		const usd = (+ethers.utils.formatEther(
			price.times(liquidAmount.toString()).toFixed(0),
		)).toFixed(2);
		setUSDAmount(usd);
	}, [
		getTokenPrice,
		liquidAmount,
		network,
		streamConfig.tokenAddressOnUniswapV2,
	]);

	return (
		<>
			<RewardCardContainer>
				<AmountInfo alignItems='flex-end' gap='4px'>
					{getStreamIconWithType(streamConfig.type, 24)}
					<Amount>{formatWeiHelper(liquidAmount)}</Amount>
					<AmountUnit>{streamConfig.rewardTokenSymbol}</AmountUnit>
				</AmountInfo>
				<Converted>~${usdAmount}</Converted>
				<HarvestButton
					label={`HARVEST ${streamConfig.rewardTokenSymbol}`}
					onClick={() => setShowModal(true)}
					buttonType='primary'
					disabled={liquidAmount.isZero()}
				/>
			</RewardCardContainer>
			{showModal && (
				<HarvestAllModal
					title={streamConfig.rewardTokenSymbol + 'stream Rewards'}
					showModal={showModal}
					setShowModal={setShowModal}
					network={network}
					regenStreamConfig={streamConfig}
				/>
			)}
		</>
	);
};

const RewardCardContainer = styled.div`
	width: 257px;
	padding: 24px;
	background-color: ${brandColors.giv[700]};
	border-radius: 8px;
`;

const AmountInfo = styled(Flex)``;

const Amount = styled(SemiTitle)`
	margin-left: 4px;
`;

const AmountUnit = styled(Subline)`
	color: ${brandColors.deep[100]};
`;

const Converted = styled(Subline)`
	color: ${brandColors.deep[200]};
	margin-left: 32px;
	margin-bottom: 22px;
`;

const HarvestButton = styled(Button)`
	width: 100%;
`;
