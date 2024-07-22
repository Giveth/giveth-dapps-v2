import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { H2, H5, Lead, Flex } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import {
	APRRow,
	ArrowButton,
	Card,
	ImpactCard,
	ImpactCardInput,
	ImpactCardLabel,
	MaxStakeGIV,
	PoolCard,
	PoolCardContainer,
	PoolCardFooter,
	PoolCardTitle,
	PoolItem,
	PoolItemBold,
	PoolItems,
	PreviousArrowButton,
} from './common';
import useClaim from '@/context/claim.context';
import config from '@/configuration';
import { formatEthHelper, formatWeiHelper, Zero } from '@/helpers/number';
import { APR } from '@/types/poolInfo';
import { getLPStakingAPR } from '@/lib/stakingPool';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { getNowUnixMS } from '@/helpers/time';
import { IClaimViewCardProps } from '../Claim.view';
import { WeiPerEther } from '@/lib/constants/constants';
import { InputWithUnit } from '@/components/input/InputWithUnit';
import { fetchSubgraphData } from '@/components/controller/subgraph.ctrl';

const InvestCardContainer = styled(Card)`
	&::before {
		content: '';
		background-image: url('/images/earn.png');
		position: absolute;
		width: 368px;
		height: 361px;
		bottom: 0;
		right: 0;
		z-index: -1;
	}
	@media only screen and (max-width: 1120px) {
		padding: 8px 16px;
	}
`;

export const Header = styled.div`
	margin-bottom: 92px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 8px;
	}
`;
const StakeHeader = styled.div`
	margin-bottom: 60px;
	@media only screen and (max-width: 1360px) {
		margin-bottom: 40px;
	}
	@media only screen and (max-width: 1120px) {
		margin-bottom: 20px;
	}
`;

const Title = styled(H2)`
	font-size: 3.2em;
	width: 750px;
	font-weight: 700;
	@media only screen and (max-width: 1360px) {
		width: 700px;
	}
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

const Desc = styled(Lead)`
	margin-top: 22px;
	@media only screen and (max-width: 1120px) {
		margin-top: 8px;
	}
`;

const InvestCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goNextStep, goPreviousStep } = useClaim();
	const { formatMessage } = useIntl();
	const [deposit, setDeposit] = useState<string>('0');
	const [potentialClaim, setPotentialClaim] = useState(0n);
	const [earnEstimate, setEarnEstimate] = useState(0n);
	const [APR, setAPR] = useState<BigNumber>(Zero);

	const { address } = useAccount();
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const gnosisValues = useQuery({
		queryKey: ['subgraph', config.GNOSIS_NETWORK_NUMBER, address],
		queryFn: async () =>
			await fetchSubgraphData(config.GNOSIS_NETWORK_NUMBER, address),
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});

	const mainnetValues = useQuery({
		queryKey: ['subgraph', config.MAINNET_NETWORK_NUMBER, address],
		queryFn: async () =>
			await fetchSubgraphData(config.MAINNET_NETWORK_NUMBER, address),
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});

	useEffect(() => {
		if (totalAmount) {
			setDeposit(formatWeiHelper(totalAmount / 10n));
		}
	}, [totalAmount]);

	useEffect(() => {
		let _deposit = 0;
		if (deposit !== '.' && deposit !== '') {
			_deposit = parseFloat(deposit);
		}
		const stackedWithApr = APR ? APR.times(_deposit).div(1200) : Zero;
		if (stackedWithApr.isNaN()) return;
		const _convertedStackedWithApr =
			BigNumber(stackedWithApr).multipliedBy(WeiPerEther);
		const convertedStackedWithApr = BigInt(
			_convertedStackedWithApr.toFixed(0),
		);
		setPotentialClaim(
			givTokenDistroHelper.getLiquidPart(convertedStackedWithApr),
		);
		setEarnEstimate(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				convertedStackedWithApr,
			),
		);
		// setPotentialClaim(stackedWithApr.times(0.1));
		// setEarnEstimate(stackedWithApr.times(0.9).div(52 * 5));
	}, [APR, deposit, totalAmount, givTokenDistroHelper]);

	const mounted = useRef(true);
	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	useEffect(() => {
		if (!gnosisValues.data || !mainnetValues.data) return;
		const getMaxAPR = async (promises: Promise<APR>[]) => {
			const stakePoolAPRs = await Promise.all(promises);
			let maxApr = Zero;
			stakePoolAPRs.forEach(apr => {
				maxApr = BigNumber.max(maxApr, apr?.effectiveAPR || Zero);
			});
			setAPR(maxApr);
		};

		const promiseQueue: Promise<APR>[] = [];
		config.GNOSIS_CONFIG.pools.forEach(poolStakingConfig => {
			const promise: Promise<APR> = getLPStakingAPR(
				poolStakingConfig as SimplePoolStakingConfig,
				gnosisValues.data,
			);
			promiseQueue.push(promise);
		});
		config.MAINNET_CONFIG.pools.forEach(poolStakingConfig => {
			const isDiscontinued = poolStakingConfig.farmEndTimeMS
				? getNowUnixMS() > poolStakingConfig.farmEndTimeMS
				: false;
			if (
				poolStakingConfig.exploited ||
				isDiscontinued ||
				poolStakingConfig.type === StakingType.UNISWAPV3_ETH_GIV
			)
				return;

			const promise: Promise<APR> = getLPStakingAPR(
				poolStakingConfig as SimplePoolStakingConfig,
				mainnetValues.data,
			);
			promiseQueue.push(promise);
		});
		getMaxAPR(promiseQueue);
	}, [mainnetValues.data, gnosisValues.data]);

	return (
		<InvestCardContainer $activeIndex={step} $index={index}>
			<StakeHeader>
				<Title as='h1'>Grow your Rewards</Title>
				<Desc>
					Provide liquidity and get rewarded. Stake tokens in the{' '}
					<b>GIVfarm</b> to earn up to{' '}
					{APR ? `${formatEthHelper(APR)}% APR` : ' ? '}
				</Desc>
			</StakeHeader>
			<APRRow
				$alignItems={'flex-start'}
				$justifyContent={'space-between'}
			>
				<ImpactCard>
					<H5 as='h2' weight={700}>
						See how much you could earn
					</H5>
					<div>
						<Flex
							$alignItems={'center'}
							$justifyContent={'space-between'}
						>
							<ImpactCardLabel>If you deposit</ImpactCardLabel>
							<MaxStakeGIV
								onClick={() =>
									setDeposit(
										formatWeiHelper(
											(totalAmount / 10n).toString(),
										),
									)
								}
							>{`Max ${(
								totalAmount / 10n
							).toString()} GIV`}</MaxStakeGIV>
						</Flex>
						<ImpactCardInput>
							<InputWithUnit
								type='number'
								value={deposit}
								unit={'GIV'}
								onChange={setDeposit}
							/>
						</ImpactCardInput>
					</div>
				</ImpactCard>
				<PoolCardContainer>
					<PoolCardTitle>If you stake for 1 month:</PoolCardTitle>
					<PoolCard>
						<PoolItems>
							<Flex $justifyContent='space-between'>
								<PoolItem>APR</PoolItem>
								<PoolItemBold>
									<Image
										src='/images/icons/star.svg'
										height='16'
										width='16'
										alt='Star icon'
									/>
									{formatEthHelper(APR ? APR : Zero)}%
								</PoolItemBold>
							</Flex>
							<Flex $justifyContent='space-between'>
								<PoolItem>Claimable</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(potentialClaim)} GIV
								</PoolItemBold>
							</Flex>
							<Flex $justifyContent='space-between'>
								<PoolItem>Streaming</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(earnEstimate)} GIV
									{formatMessage({ id: 'label./week' })}
								</PoolItemBold>
							</Flex>
						</PoolItems>
					</PoolCard>
				</PoolCardContainer>
			</APRRow>
			<PoolCardFooter>
				These calculators demonstrate how you can use GIV to participate
				in the GIVeconomy! <b>These are just simulations.</b> To
				participate for real, claim your GIV.
			</PoolCardFooter>
			{step === index && (
				<>
					<ArrowButton onClick={goNextStep} />
					<PreviousArrowButton onClick={goPreviousStep} />{' '}
				</>
			)}
		</InvestCardContainer>
	);
};

export default InvestCard;
