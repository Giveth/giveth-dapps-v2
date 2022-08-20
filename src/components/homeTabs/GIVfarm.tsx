import React, { useEffect, useState } from 'react';
import {
	IconGIVFarm,
	IconExternalLink,
	GLink,
	IconCopy,
} from '@giveth/ui-design-system';
import { BigNumber } from 'bignumber.js';
import { constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '@/components/styled-components/Flex';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import config from '@/configuration';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import {
	GIVfarmTopContainer,
	Subtitle,
	Title,
	GIVfarmRewardCard,
	PoolRow,
	ContractRow,
	CopyWrapper,
	GIVfarmBottomContainer,
	ArchivedPoolsToggle,
} from './GIVfarm.sc';
import RadioButton from '@/components/RadioButton';
import { NetworkSelector } from '@/components/NetworkSelector';
import StakingPositionCard from '@/components/cards/StakingPositionCard';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { useFarms } from '@/context/farm.context';
import { TopInnerContainer, ExtLinkRow } from './commons';
import { GIVfrens } from '@/components/GIVfrens';
import { shortenAddress } from '@/lib/helpers';
import { Col, Container, Row } from '@/components/Grid';
import links from '@/lib/constants/links';
import {
	DaoCard,
	DaoCardTitle,
	DaoCardQuote,
	DaoCardButton,
} from '../GIVfrens.sc';

const renderPools = (chainId?: number, showArchivedPools?: boolean) => {
	const pools = [...config.MAINNET_CONFIG.pools, ...config.XDAI_CONFIG.pools];
	if (chainId === config.XDAI_NETWORK_NUMBER) {
		pools.reverse();
	}
	return pools
		.filter(p => (showArchivedPools ? true : p.active && !p.archived))
		.map((poolStakingConfig, idx) => ({ poolStakingConfig, idx }))
		.sort(
			(
				{
					idx: idx1,
					poolStakingConfig: { active: active1, archived: archived1 },
				},
				{
					idx: idx2,
					poolStakingConfig: { active: active2, archived: archived2 },
				},
			) =>
				+active2 - +active1 ||
				+!!archived2 - +!!archived1 ||
				idx1 - idx2,
		)
		.map(({ poolStakingConfig }, index) => {
			const network = poolStakingConfig?.network || 0;
			return (
				<Col
					sm={6}
					lg={4}
					key={`staking_pool_card_${network}_${index}`}
				>
					{poolStakingConfig.type ===
					StakingType.UNISWAPV3_ETH_GIV ? (
						<StakingPositionCard
							poolStakingConfig={poolStakingConfig}
						/>
					) : (
						<StakingPoolCard
							key={`staking_pool_card_${network}_${index}`}
							poolStakingConfig={
								poolStakingConfig as SimplePoolStakingConfig
							}
						/>
					)}
				</Col>
			);
		});
};

export const TabGIVfarmTop = () => {
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const { totalEarned } = useFarms();
	const { chainId } = useWeb3React();

	useEffect(() => {
		setRewardLiquidPart(givTokenDistroHelper.getLiquidPart(totalEarned));
		setRewardStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(totalEarned),
		);
	}, [totalEarned, givTokenDistroHelper]);

	return (
		<GIVfarmTopContainer>
			<TopInnerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={7} xl={8}>
						<Flex alignItems='baseline' gap='16px'>
							<Title>GIVfarm</Title>
							<IconGIVFarm size={64} />
						</Flex>
						<Subtitle size='medium'>
							Stake tokens in the GIVfarm to grow your rewards.
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} xl={4}>
						<GIVfarmRewardCard
							title='Your GIVfarm rewards'
							wrongNetworkText='GIVfarm is only available on Mainnet and Gnosis Chain.'
							liquidAmount={rewardLiquidPart}
							stream={rewardStream}
							network={chainId}
							targetNetworks={[
								config.MAINNET_NETWORK_NUMBER,
								config.XDAI_NETWORK_NUMBER,
							]}
						/>
					</Col>
				</Row>
			</TopInnerContainer>
		</GIVfarmTopContainer>
	);
};

export const TabGIVfarmBottom = () => {
	const { chainId } = useWeb3React();
	const [showArchivedPools, setArchivedPools] = useState(false);

	return (
		<GIVfarmBottomContainer>
			<Container>
				<Flex
					alignItems='center'
					gap='24px'
					wrap={1}
					justifyContent='space-between'
				>
					<NetworkSelector />
					<Flex alignItems='center' gap='24px' wrap={1}>
						<ExtLinkRow alignItems='center'>
							<GLink
								size='Big'
								target='_blank'
								rel='noreferrer'
								href='https://omni.xdaichain.com/bridge'
							>
								Bridge your GIV
							</GLink>
							<IconExternalLink />
						</ExtLinkRow>
						<ExtLinkRow alignItems='center'>
							<GLink
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
							</GLink>
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
											: config.MAINNET_CONFIG
													.TOKEN_ADDRESS,
									);
								}}
							>
								<IconCopy />
							</CopyWrapper>
						</ContractRow>
					</Flex>
				</Flex>
				<ArchivedPoolsToggle>
					<RadioButton
						title='Show archived pools'
						toggleRadio={() => setArchivedPools(!showArchivedPools)}
						isSelected={showArchivedPools}
					/>
				</ArchivedPoolsToggle>
				<>
					<PoolRow>
						<Col sm={6} lg={4}>
							<StakingPoolCard
								poolStakingConfig={getGivStakingConfig(
									config.XDAI_CONFIG,
								)}
							/>
						</Col>
						<Col sm={6} lg={4}>
							<StakingPoolCard
								poolStakingConfig={getGivStakingConfig(
									config.MAINNET_CONFIG,
								)}
							/>
						</Col>
						{renderPools(chainId, showArchivedPools)}
					</PoolRow>
					{chainId === config.XDAI_NETWORK_NUMBER ? (
						<GIVfrens
							regenFarms={config.XDAI_CONFIG.regenFarms}
							network={config.XDAI_NETWORK_NUMBER}
						/>
					) : (
						<GIVfrens
							regenFarms={config.MAINNET_CONFIG.regenFarms}
							network={config.MAINNET_NETWORK_NUMBER}
						/>
					)}
				</>
				<Col xs={12}>
					<DaoCard>
						<DaoCardTitle weight={900}>Add Your DAO</DaoCardTitle>
						<DaoCardQuote size='small'>
							Apply to kickstart a RegenFarm for your for-good DAO
						</DaoCardQuote>
						<DaoCardButton
							label='APPLY NOW'
							linkType='primary'
							href={links.JOINGIVFRENS}
							target='_blank'
						/>
					</DaoCard>
				</Col>
			</Container>
		</GIVfarmBottomContainer>
	);
};
