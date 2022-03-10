import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import config from '@/configuration';
import { StakingType } from '@/types/config';
import React, { useEffect, useState } from 'react';
import {
	GIVfarmTopContainer,
	Left,
	Right,
	Subtitle,
	Title,
	GIVfarmRewardCard,
	PoolRow,
	ContractRow,
	CopyWrapper,
} from './GIVfarm.sc';
import {
	IconGIVFarm,
	IconExternalLink,
	GLink,
	IconCopy,
} from '@giveth/ui-design-system';
import { NetworkSelector } from '@/components/NetworkSelector';
import StakingPositionCard from '@/components/cards/StakingPositionCard';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { BigNumber } from 'bignumber.js';
import { constants } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { useFarms } from '@/context/farm.context';
import { TopFiller, TopInnerContainer, ExtLink, ExtLinkRow } from './commons';
import { useWeb3React } from '@web3-react/core';
import { shortenAddress } from '@/lib/helpers';
import { Container } from '@/components/Grid';

const GIVfarmTabContainer = styled(Container)``;

export const TabGIVfarmTop = () => {
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { tokenDistroHelper } = useTokenDistro();
	const { totalEarned } = useFarms();
	const { chainId } = useWeb3React();

	useEffect(() => {
		setRewardLiquidPart(tokenDistroHelper.getLiquidPart(totalEarned));
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(totalEarned),
		);
	}, [totalEarned, tokenDistroHelper]);

	return (
		<GIVfarmTopContainer>
			<TopInnerContainer>
				<TopFiller />
				<Flex justifyContent='space-between'>
					<Left>
						<Flex alignItems='baseline' gap='16px'>
							<Title>GIVfarm</Title>
							<IconGIVFarm size={64} />
						</Flex>
						<Subtitle size='medium'>
							Stake tokens in the GIVfarm to grow your rewards.
						</Subtitle>
					</Left>
					<Right>
						<GIVfarmRewardCard
							title='Your GIVfarm rewards'
							wrongNetworkText='GIVfarm is only available on Mainnet and xDAI.'
							liquidAmount={rewardLiquidPart}
							stream={rewardStream}
							network={chainId}
							targetNetworks={[
								config.MAINNET_NETWORK_NUMBER,
								config.XDAI_NETWORK_NUMBER,
							]}
						/>
					</Right>
				</Flex>
			</TopInnerContainer>
		</GIVfarmTopContainer>
	);
};

export const TabGIVfarmBottom = () => {
	const { chainId } = useWeb3React();
	const supportedNetworks = [
		config.MAINNET_NETWORK_NUMBER,
		config.XDAI_NETWORK_NUMBER,
	];

	return (
		<GIVfarmTabContainer>
			<Flex alignItems='center' gap='24px'>
				<NetworkSelector />
				<ExtLinkRow alignItems='center'>
					<ExtLink
						size='Big'
						target='_blank'
						rel='noreferrer'
						href='https://omni.xdaichain.com/bridge'
					>
						Bridge your GIV
					</ExtLink>
					<IconExternalLink />
				</ExtLinkRow>
				<ExtLinkRow alignItems='center'>
					<ExtLink
						size='Big'
						target='_blank'
						rel='noreferrer'
						href={
							chainId === config.XDAI_NETWORK_NUMBER
								? config.XDAI_CONFIG.GIV.BUY_LINK
								: config.MAINNET_CONFIG.GIV.BUY_LINK
						}
					>
						Buy GIV token
					</ExtLink>
					<IconExternalLink />
				</ExtLinkRow>
				<ContractRow>
					<GLink>{`Contract (${
						chainId === config.XDAI_NETWORK_NUMBER
							? config.XDAI_CONFIG.chainName
							: config.MAINNET_CONFIG.chainName
					}):`}</GLink>
					<GLink>
						{shortenAddress(
							chainId === config.XDAI_NETWORK_NUMBER
								? config.XDAI_CONFIG.TOKEN_ADDRESS
								: config.MAINNET_CONFIG.TOKEN_ADDRESS,
						)}
					</GLink>
					<CopyWrapper
						onClick={() => {
							navigator.clipboard.writeText(
								chainId === config.XDAI_NETWORK_NUMBER
									? config.XDAI_CONFIG.TOKEN_ADDRESS
									: config.MAINNET_CONFIG.TOKEN_ADDRESS,
							);
						}}
					>
						<IconCopy />
					</CopyWrapper>
				</ContractRow>
			</Flex>
			{chainId === config.XDAI_NETWORK_NUMBER && (
				<PoolRow justifyContent='center' gap='24px' wrap={1}>
					{config.XDAI_CONFIG.pools.map(
						(poolStakingConfig, index) => {
							return (
								<StakingPoolCard
									key={`staking_pool_card_xdai_${index}`}
									network={config.XDAI_NETWORK_NUMBER}
									poolStakingConfig={poolStakingConfig}
								/>
							);
						},
					)}
					<StakingPoolCard
						network={config.XDAI_NETWORK_NUMBER}
						poolStakingConfig={getGivStakingConfig(
							config.XDAI_CONFIG,
						)}
					/>
				</PoolRow>
			)}
			{(!chainId ||
				chainId === config.MAINNET_NETWORK_NUMBER ||
				!supportedNetworks.includes(chainId)) && (
				<PoolRow
					justifyContent='center'
					gap='24px'
					wrap={1}
					disabled={!chainId || !supportedNetworks.includes(chainId)}
				>
					{config.MAINNET_CONFIG.pools.map(
						(poolStakingConfig, index) => {
							return poolStakingConfig.type ===
								StakingType.UNISWAP ? (
								<StakingPositionCard
									key={`staking_pool_card_mainnet_${index}`}
									network={config.MAINNET_NETWORK_NUMBER}
									poolStakingConfig={poolStakingConfig}
								/>
							) : (
								<StakingPoolCard
									key={`staking_pool_card_mainnet_${index}`}
									network={config.MAINNET_NETWORK_NUMBER}
									poolStakingConfig={poolStakingConfig}
								/>
							);
						},
					)}
					<StakingPoolCard
						network={config.MAINNET_NETWORK_NUMBER}
						poolStakingConfig={getGivStakingConfig(
							config.MAINNET_CONFIG,
						)}
					/>
				</PoolRow>
			)}
		</GIVfarmTabContainer>
	);
};
