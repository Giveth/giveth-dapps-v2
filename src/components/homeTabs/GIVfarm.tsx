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
import { BasicNetworkConfig, StakingType } from '@/types/config';
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
import RadioTitle from '@/components/views/donate/RadioTitle';
import { NetworkSelector } from '@/components/NetworkSelector';
import StakingPositionCard from '@/components/cards/StakingPositionCard';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { useFarms } from '@/context/farm.context';
import { TopInnerContainer, ExtLinkRow } from './commons';
import { GIVfrens } from '@/components/GIVfrens';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import { shortenAddress } from '@/lib/helpers';
import { Col, Container, Row } from '@/components/Grid';
import links from '@/lib/constants/links';
import {
	DaoCard,
	DaoCardTitle,
	DaoCardQuote,
	DaoCardButton,
} from '../GIVfrens.sc';

const renderPools = (
	pools: BasicNetworkConfig['pools'],
	network: number,
	showArchivedPools?: boolean,
) => {
	return pools
		.filter(p => (showArchivedPools ? true : !!p.active))
		.sort(p => (p.active ? -1 : 1))
		.map((poolStakingConfig, index) => {
			return (
				<Col
					sm={6}
					lg={4}
					key={`staking_pool_card_${network}_${index}`}
				>
					{poolStakingConfig.type === StakingType.UNISWAPV3 ? (
						<StakingPositionCard
							poolStakingConfig={poolStakingConfig}
						/>
					) : (
						<StakingPoolCard
							key={`staking_pool_card_${network}_${index}`}
							network={network}
							poolStakingConfig={poolStakingConfig}
						/>
					)}
				</Col>
			);
		});
};

export const TabGIVfarmTop = () => {
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useTokenDistro();
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
				<Flex alignItems='center' gap='24px' wrap={1}>
					<NetworkSelector />
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
										: config.MAINNET_CONFIG.TOKEN_ADDRESS,
								);
							}}
						>
							<IconCopy />
						</CopyWrapper>
					</ContractRow>
				</Flex>
				<ArchivedPoolsToggle>
					<RadioTitle
						title='Show archived pools'
						toggleRadio={() => setArchivedPools(!showArchivedPools)}
						isSelected={showArchivedPools}
					/>
				</ArchivedPoolsToggle>

				{chainId === config.XDAI_NETWORK_NUMBER && (
					<>
						<PoolRow>
							<Col sm={6} lg={4}>
								<StakingPoolCard
									network={config.XDAI_NETWORK_NUMBER}
									poolStakingConfig={getGivStakingConfig(
										config.XDAI_CONFIG,
									)}
								/>
							</Col>
							{renderPools(
								config.XDAI_CONFIG.pools,
								config.XDAI_NETWORK_NUMBER,
								showArchivedPools,
							)}
						</PoolRow>
						<GIVfrens
							regenFarms={config.XDAI_CONFIG.regenFarms}
							network={config.XDAI_NETWORK_NUMBER}
						/>
					</>
				)}
				{(!chainId ||
					chainId === config.MAINNET_NETWORK_NUMBER ||
					!givEconomySupportedNetworks.includes(chainId)) && (
					<>
						<PoolRow
							disabled={
								!chainId ||
								!givEconomySupportedNetworks.includes(chainId)
							}
						>
							<Col sm={6} lg={4}>
								<StakingPoolCard
									network={config.MAINNET_NETWORK_NUMBER}
									poolStakingConfig={getGivStakingConfig(
										config.MAINNET_CONFIG,
									)}
								/>
							</Col>
							{renderPools(
								config.MAINNET_CONFIG.pools,
								config.MAINNET_NETWORK_NUMBER,
								showArchivedPools,
							)}
						</PoolRow>
						<GIVfrens
							regenFarms={config.XDAI_CONFIG.regenFarms}
							network={config.XDAI_NETWORK_NUMBER}
						/>
					</>
				)}
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
