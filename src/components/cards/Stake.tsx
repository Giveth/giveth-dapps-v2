import { FC, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
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
import { IClaimViewCardProps } from '../views/claim/Claim.view';
import { UserContext } from '../../context/user.context';
import { BigNumber as EthersBigNumber, constants, utils } from 'ethers';
import config from '../../configuration';
import BigNumber from 'bignumber.js';
import { formatEthHelper, formatWeiHelper, Zero } from '../../helpers/number';
import { APR } from '@/types/poolInfo';
import { getLPStakingAPR } from '@/lib/stakingPool';
import { useLiquidityPositions, useSubgraph } from '@/context';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { H2, H5, Lead } from '@giveth/ui-design-system';
import { networkProviders } from '@/helpers/networkProvider';
import { StakingType } from '@/types/config';

const InvestCardContainer = styled(Card)`
	::before {
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
	const { totalAmount, step, goNextStep, goPreviousStep } =
		useContext(UserContext);

	const [deposit, setDeposit] = useState<string>('0');
	const [potentialClaim, setPotentialClaim] = useState<EthersBigNumber>(
		constants.Zero,
	);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const [APR, setAPR] = useState<BigNumber>(Zero);
	const { apr: univ3apr } = useLiquidityPositions();
	const { tokenDistroHelper } = useTokenDistro();
	const { mainnetValues, xDaiValues } = useSubgraph();

	useEffect(() => {
		if (totalAmount) {
			setDeposit(utils.formatEther(totalAmount.div(10)));
		}
	}, [totalAmount]);

	useEffect(() => {
		let _deposit = 0;
		if (deposit !== '.' && deposit !== '') {
			_deposit = parseFloat(deposit);
		}
		const stackedWithApr = APR ? APR.times(_deposit).div(1200) : Zero;
		if (stackedWithApr.isNaN()) return;
		const convertedStackedWithApr = EthersBigNumber.from(
			stackedWithApr.toFixed(0),
		).mul(constants.WeiPerEther);
		setPotentialClaim(
			tokenDistroHelper.getLiquidPart(convertedStackedWithApr),
		);
		setEarnEstimate(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				convertedStackedWithApr,
			),
		);
		// setPotentialClaim(stackedWithApr.times(0.1));
		// setEarnEstimate(stackedWithApr.times(0.9).div(52 * 5));
	}, [APR, deposit, totalAmount, tokenDistroHelper]);

	const mounted = useRef(true);
	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	useEffect(() => {
		const getMaxAPR = async (promises: Promise<APR>[]) => {
			const stakePoolAPRs = await Promise.all(promises);
			let maxApr = univ3apr;
			stakePoolAPRs.forEach(apr => {
				maxApr = BigNumber.max(maxApr, apr || Zero);
			});
			setAPR(maxApr);
		};

		const promiseQueue: Promise<APR>[] = [];
		config.XDAI_CONFIG.pools.forEach(poolStakingConfig => {
			const promise: Promise<APR> = getLPStakingAPR(
				poolStakingConfig,
				config.XDAI_NETWORK_NUMBER,
				networkProviders[config.XDAI_NETWORK_NUMBER],
				xDaiValues[poolStakingConfig.type],
			);
			promiseQueue.push(promise);
		});
		config.MAINNET_CONFIG.pools.forEach(poolStakingConfig => {
			if (poolStakingConfig.type === StakingType.UNISWAP) return;

			const promise: Promise<APR> = getLPStakingAPR(
				poolStakingConfig,
				config.MAINNET_NETWORK_NUMBER,
				networkProviders[config.MAINNET_NETWORK_NUMBER],
				mainnetValues[poolStakingConfig.type],
			);
			promiseQueue.push(promise);
		});
		getMaxAPR(promiseQueue);
	}, [univ3apr]);

	return (
		<InvestCardContainer activeIndex={step} index={index}>
			<StakeHeader>
				<Title as='h1'>Grow your Rewards</Title>
				<Desc>
					Provide liquidity and get rewarded. Stake tokens in the{' '}
					<b>GIVfarm</b> to earn up to{' '}
					{APR ? `${formatEthHelper(APR)}% APR` : ' ? '}
				</Desc>
			</StakeHeader>
			<APRRow alignItems={'flex-start'} justifyContent={'space-between'}>
				<ImpactCard>
					<H5 as='h2' weight={700}>
						See how much you could earn
					</H5>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<ImpactCardLabel>If you deposit</ImpactCardLabel>
							<MaxStakeGIV
								onClick={() =>
									setDeposit(
										utils.formatEther(totalAmount.div(10)),
									)
								}
							>{`Max ${utils.formatEther(
								totalAmount.div(10),
							)} GIV`}</MaxStakeGIV>
						</Row>
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
							<Row justifyContent='space-between'>
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
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Claimable</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(potentialClaim)} GIV
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Streaming</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(earnEstimate)} GIV/week
								</PoolItemBold>
							</Row>
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
