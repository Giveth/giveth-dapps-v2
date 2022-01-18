import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import {
	APRRow,
	ArrowButton,
	Card,
	ICardProps,
	ImpactCard,
	ImpactCardInput,
	ImpactCardLabel,
	MaxGIV,
	MaxStakeGIV,
	PoolCard,
	PoolCardContainer,
	PoolCardFooter,
	PoolItem,
	PoolItemBold,
	PoolItems,
	PreviousArrowButton,
} from './common';
import { IClaimViewCardProps } from '../views/claim/Claim.view';
import { UserContext } from '../../context/user.context';
import { utils, BigNumber as EthersBigNumber, constants } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { formatWeiHelper, Zero } from '../../helpers/number';
import BigNumber from 'bignumber.js';
import {
	Subline,
	neutralColors,
	IconHelp,
	H2,
	H4,
	P,
	Caption,
	H5,
	Lead,
	H6,
} from '@giveth/ui-design-system';
import { IconWithTooltip } from '../IconWithToolTip';

const DonatePoolCard = styled(PoolCard)`
	height: 127px;
`;

const DonateCardContainer = styled(Card)`
	padding-right: 154px;
	::before {
		content: '';
		background-image: url('/images/donate.png');
		position: absolute;
		width: 305px;
		height: 333px;
		top: 0;
		right: 0;
		z-index: -1;
	}
	@media only screen and (max-width: 1360px) {
		padding-right: 112px;
		::before {
			width: 240px;
			background-size: contain;
			background-repeat: no-repeat;
		}
	}
	@media only screen and (max-width: 1360px) {
		@media only screen and (max-width: 1120px) {
		padding: 8px;
		::before {
			background-image: none;
		}
	}
`;
const GdropDonateTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 260px;
`;

const DonateHeader = styled.div`
	margin-bottom: 15px;
`;

const Title = styled(H2)`
	font-size: 3.2em;
	font-weight: 700;
	width: 750px;
	@media only screen and (max-width: 1360px) {
		width: 100%;
	}
`;

const Desc = styled(Lead)`
	max-width: 700px;
	margin-top: 22px;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

export const DonateCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goNextStep, goPreviousStep } =
		useContext(UserContext);

	const [donation, setDonation] = useState<string>('0');
	const [potentialClaim, setPotentialClaim] = useState<EthersBigNumber>(
		constants.Zero,
	);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const { tokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		if (totalAmount) {
			setDonation(utils.formatEther(totalAmount.div(10)));
		}
	}, [totalAmount]);

	useEffect(() => {
		let _donation = 0;
		if (donation !== '.' && donation !== '') {
			_donation = parseFloat(donation);
		}
		const donationWithGivBacks = _donation * 0.75;
		const convertedStackedWithApr = EthersBigNumber.from(
			donationWithGivBacks.toFixed(0),
		).mul(constants.WeiPerEther);
		setPotentialClaim(
			tokenDistroHelper.getLiquidPart(convertedStackedWithApr),
		);
		setEarnEstimate(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				convertedStackedWithApr,
			),
		);
	}, [donation, tokenDistroHelper]);

	return (
		<DonateCardContainer activeIndex={step} index={index}>
			<DonateHeader>
				<Title>Donate &amp; get GIV back</Title>
				<Desc>
					Donate to verified projects to get GIV with <b>GIVbacks</b>.
					The project gets 100% of your donation, and you get rewarded
					by Giveth with GIV!
				</Desc>
			</DonateHeader>
			<APRRow alignItems={'center'} justifyContent={'space-between'}>
				<ImpactCard>
					<H5 as='h2' weight={700}>
						If you donate your GIVdrop
					</H5>
					<div>
						<Row justifyContent={'space-between'}>
							<Row gap='4px' alignItems='center'>
								<ImpactCardLabel>Your donation</ImpactCardLabel>
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'top'}
								>
									<GdropDonateTooltip>
										Donations made in most tokens are
										eligible for GIVbacks.
									</GdropDonateTooltip>
								</IconWithTooltip>
							</Row>
							<MaxStakeGIV
								onClick={() =>
									setDonation(
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
								value={donation}
								unit={'GIV'}
								onChange={setDonation}
							/>
						</ImpactCardInput>
					</div>
				</ImpactCard>
				<PoolCardContainer>
					<DonatePoolCard>
						<PoolItems>
							<Row justifyContent='space-between'>
								<PoolItem>GIVbacks</PoolItem>
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
					</DonatePoolCard>
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
					<PreviousArrowButton onClick={goPreviousStep} />
				</>
			)}
		</DonateCardContainer>
	);
};
