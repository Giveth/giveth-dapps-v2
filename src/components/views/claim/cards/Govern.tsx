import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import { utils, BigNumber as EthersBigNumber, constants } from 'ethers';
import styled from 'styled-components';
import { H2, H5, Lead } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useIntl } from 'react-intl';
import {
	APRRow,
	ArrowButton,
	Card,
	ImpactCard,
	ImpactCardInput,
	ImpactCardLabel,
	MaxGIV,
	PoolCard,
	PoolCardContainer,
	PoolCardFooter,
	PoolCardTitle,
	PoolItem,
	PoolItemBold,
	PoolItems,
	PreviousArrowButton,
} from './common';

import config from '@/configuration';
import { formatEthHelper, formatWeiHelper, Zero } from '@/helpers/number';
import { getGivStakingAPR } from '@/lib/stakingPool';
import { APR } from '@/types/poolInfo';
import useClaim from '@/context/claim.context';
import { useAppSelector } from '@/features/hooks';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { InputWithUnit } from '@/components/input';
import { Flex } from '@/components/styled-components/Flex';
import { IClaimViewCardProps } from '../Claim.view';

const GovernCardContainer = styled(Card)`
	padding-left: 254px;
	::before {
		content: '';
		background-image: url('/images/vote.png');
		position: absolute;
		width: 274px;
		height: 313px;
		bottom: 0;
		left: 0;
		z-index: -1;
	}
	@media only screen and (max-width: 1360px) {
		padding-left: 112px;
		::before {
			width: 170px;
			height: 150px;
			background-size: contain;
			background-repeat: no-repeat;
		}
	}
	@media only screen and (max-width: 1120px) {
		padding: 8px;
		::before {
			background-image: none;
		}
	}
`;

const BeeImage = styled.div`
	position: absolute;
	left: 40px;
	@media only screen and (max-width: 1360px) {
		left: 10px;
		width: 80px;
	}
	@media only screen and (max-width: 1120px) {
		display: none;
	}
`;

const GovernHeader = styled.div`
	margin-bottom: 60px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 16px;
	}
`;

const Title = styled(H2)`
	font-size: 3.2em;
	font-weight: 700;
	width: 750px;
`;

const Desc = styled(Lead)`
	max-width: 650px;
	margin-top: 22px;
`;

const MaxStakeGIV = styled(MaxGIV)`
	cursor: pointer;
`;

const GovernCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goNextStep, goPreviousStep } = useClaim();
	const { formatMessage } = useIntl();

	const [stacked, setStacked] = useState<string>('0');
	const [potentialClaim, setPotentialClaim] = useState<EthersBigNumber>(
		constants.Zero,
	);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const [apr, setApr] = useState<APR>(null);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const xDaiValues = useAppSelector(state => state.subgraph.xDaiValues);

	useEffect(() => {
		let _stacked = 0;
		if (stacked !== '.' && stacked !== '') {
			_stacked = parseFloat(stacked);
		}
		const stackedWithApr = apr
			? apr.effectiveAPR.times(_stacked).div(1200)
			: Zero;
		const convertedStackedWithApr = EthersBigNumber.from(
			stackedWithApr.toFixed(0),
		).mul(constants.WeiPerEther);
		setPotentialClaim(
			givTokenDistroHelper.getLiquidPart(convertedStackedWithApr),
		);
		setEarnEstimate(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				convertedStackedWithApr,
			),
		);
	}, [apr, stacked, totalAmount, givTokenDistroHelper]);

	useEffect(() => {
		if (totalAmount) {
			setStacked(utils.formatEther(totalAmount.div(10)));
		}
	}, [totalAmount]);

	const mounted = useRef(true);
	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	useEffect(() => {
		const cb = () => {
			getGivStakingAPR(config.XDAI_NETWORK_NUMBER, xDaiValues, null)
				.then(_apr => {
					mounted.current && setApr(_apr);
				})
				.catch(e => {
					console.error('Error on fetching APR:', e);
					captureException(e, {
						tags: {
							section: 'getGivStakingAPR',
						},
					});
				});
		};

		cb();
		const interval = setInterval(cb, 120 * 1000);

		return () => clearInterval(interval);
	}, [stacked, xDaiValues]);

	return (
		<GovernCardContainer activeIndex={step} index={index}>
			<BeeImage>
				<Image
					src='/images/bee1.svg'
					height='81'
					width='112'
					alt='Image of a happy bee'
				/>
			</BeeImage>
			<GovernHeader>
				<Title as='h1'>
					{formatMessage({ id: 'label.engage_in_governance' })}
				</Title>

				<Desc>
					{formatMessage({
						id: 'label.participate_in_giveth_governance_using_the',
					})}{' '}
					<b>GIVgarden</b>.{' '}
					{formatMessage({
						id: 'label.wrap_give_to_vote_on_proposals_and_earn_rewards',
					})}
				</Desc>
			</GovernHeader>
			<APRRow alignItems={'center'} justifyContent={'flex-end'}>
				<ImpactCard>
					<H5 as='h2' weight={700}>
						{formatMessage({
							id: 'label.if_you_vote_with_giv_tokens',
						})}
					</H5>
					<div>
						<Flex
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<ImpactCardLabel>
								{formatMessage({
									id: 'label.amount_of_giv_wrapped',
								})}
							</ImpactCardLabel>
							<MaxStakeGIV
								onClick={() =>
									setStacked(
										utils.formatEther(totalAmount.div(10)),
									)
								}
							>{`Max ${utils.formatEther(
								totalAmount.div(10),
							)} GIV`}</MaxStakeGIV>
						</Flex>
						<ImpactCardInput>
							<InputWithUnit
								type='number'
								value={stacked}
								unit={'GIV'}
								onChange={setStacked}
							/>
						</ImpactCardInput>
					</div>
				</ImpactCard>
				<PoolCardContainer>
					<PoolCardTitle>
						{formatMessage({
							id: 'label.if_you_wrap_for_one_month',
						})}
					</PoolCardTitle>
					<PoolCard>
						<PoolItems>
							<Flex justifyContent='space-between'>
								<PoolItem>APR</PoolItem>
								<PoolItemBold>
									<Image
										src='/images/icons/star.svg'
										height='16'
										width='16'
										alt='Star icon'
									/>
									{formatEthHelper(
										apr ? apr.effectiveAPR : Zero,
									)}
									%
								</PoolItemBold>
							</Flex>
							<Flex justifyContent='space-between'>
								<PoolItem>
									{formatMessage({ id: 'label.claimable' })}
								</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(potentialClaim)} GIV
								</PoolItemBold>
							</Flex>
							<Flex justifyContent='space-between'>
								<PoolItem>
									{formatMessage({ id: 'label.streaming' })}
								</PoolItem>
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
				{formatMessage({
					id: 'label.these_calculators_demonstrate_how_you_can_use_giv',
				})}{' '}
				<b>
					{formatMessage({ id: 'label.these_are_just_simulations' })}
				</b>{' '}
				{formatMessage({
					id: 'label.to_participate_for_real_claim_your_giv',
				})}
			</PoolCardFooter>
			{step === index && (
				<>
					<ArrowButton onClick={goNextStep} />
					<PreviousArrowButton onClick={goPreviousStep} />
				</>
			)}
		</GovernCardContainer>
	);
};

export default GovernCard;
