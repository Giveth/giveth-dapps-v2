import { B, Lead, Container, Flex, Row, Col } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';
import { Desc, Title } from '@/components/views/projects/qfBanner/common';
import { useAppSelector } from '@/features/hooks';

enum ERoundStatus {
	LOADING,
	NOT_STARTED,
	RUNNING,
	ENDED,
	NO_ACTIVE,
}

export const CauseActiveQFBanner = () => {
	const [state, setState] = useState(ERoundStatus.LOADING);
	const [timer, setTimer] = useState<number | null>(null);
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);

	// Image format is being bad formatted so managing locally instead
	const isGIVPalooza = activeQFRound?.name === 'GIV-a-Palooza';
	useEffect(() => {
		if (!activeQFRound) return setState(ERoundStatus.NO_ACTIVE);
		const _startDate = new Date(activeQFRound?.beginDate).getTime();
		const _endDate = new Date(activeQFRound?.endDate).getTime();
		const now = getNowUnixMS();
		const isRoundStarted = now > _startDate;
		const isRoundEnded = now > _endDate;
		if (!isRoundStarted) {
			setState(ERoundStatus.NOT_STARTED);
		} else if (!isRoundEnded) {
			setState(ERoundStatus.RUNNING);
		} else {
			setState(ERoundStatus.ENDED);
		}
	}, [activeQFRound]);

	useEffect(() => {
		let _date: number;
		if (!activeQFRound) return;
		if (state === ERoundStatus.NOT_STARTED) {
			_date = new Date(activeQFRound.beginDate).getTime();
		} else if (state === ERoundStatus.RUNNING) {
			_date = new Date(activeQFRound.endDate).getTime();
		} else {
			return;
		}
		const interval = setInterval(() => {
			const diff = _date - getNowUnixMS();
			if (diff <= 0) {
				if (state === ERoundStatus.NOT_STARTED) {
					setState(ERoundStatus.RUNNING);
				} else if (state === ERoundStatus.RUNNING) {
					setState(ERoundStatus.ENDED);
				}
				return;
			}
			setTimer(diff);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [state, activeQFRound]);

	return (
		<BannerContainer>
			<Image
				src={
					isGIVPalooza
						? '/images/banners/giv-palooza-bg1.svg'
						: activeQFRound?.bannerBgImage ||
							'/images/banners/qf-round/bg.svg'
				}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Container>
				<ActiveStyledRow>
					<ActiveStyledCol xs={12} md={6}>
						<TitleWrapper weight={700}>
							{activeQFRound ? activeQFRound.name : null}
						</TitleWrapper>
						{/*<H2>*/}
						{/*	{formatMessage({ id: 'label.quadratic_funding' })}*/}
						{/*</H2>*/}
						{(state === ERoundStatus.NOT_STARTED ||
							state === ERoundStatus.RUNNING) && (
							<Desc>
								<Lead>
									{formatMessage({
										id:
											state === ERoundStatus.NOT_STARTED
												? 'label.round_starts_in'
												: 'label.round_ends_in',
									})}
								</Lead>
								<B>
									{activeQFRound && timer && timer > 0
										? durationToString(timer, 3)
										: '--'}
								</B>
							</Desc>
						)}
					</ActiveStyledCol>
					<ActiveStyledCol
						xs={12}
						md={6}
						style={{ alignItems: 'center' }}
					>
						{/* <Flex>
							{topSponsors.map(s => (
								<SmallerSponsor
									key={s.title}
									src={s.image}
									alt={s.title}
									width={120}
									height={120}
								/>
							))}
						</Flex> */}
						{/* <ImagesWrapper>
							{sponsors.map(s => (
								<Sponsor
									key={s.title}
									src={s.image}
									alt={s.title}
									width={80}
									height={80}
								/>
							))}
						</ImagesWrapper> */}
						{/* <CustomSponsors>
							<Image
								src={'/images/banners/qf-round/giv-palooza.svg'}
								style={{
									objectFit: 'contain',
								}}
								fill
								alt='QF Sponsors'
							/>
						</CustomSponsors> */}
						{/* <BottomSponsors>
							{bottomSponsors.map(s => (
								<SmallerSponsor
									key={s.title}
									src={s.image}
									alt={s.title}
									width={120}
									height={120}
								/>
							))}
						</BottomSponsors> */}
					</ActiveStyledCol>
				</ActiveStyledRow>
			</Container>
		</BannerContainer>
	);
};

export const BannerContainer = styled(Flex)`
	height: 0;
	position: relative;
	overflow: hidden;
	margin-bottom: 0;
	align-items: start !important;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	${mediaQueries.tablet} {
		height: 210px;
		margin-bottom: -50px;
	}
`;

export const ActiveStyledRow = styled(Row)`
	flex-direction: row;
	@media (max-width: 1350px) {
		flex-direction: column-reverse;
	}
`;

export const ActiveStyledCol = styled(Col)`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 1;
	color: #ffffff;

	@media (max-width: 1350px) {
		width: 100% !important;
	}
`;

const TitleWrapper = styled(Title)`
	font-size: 36px;
`;

const ImagesWrapper = styled(Flex)`
	width: 100%;
	font-size: 36px;
	justify-content: end;
`;

export const Sponsor = styled(Image)`
	width: 85px;
	height: 95px;
`;

const sponsors = [
	{
		title: '@GloDollar',
		image: '/images/banners/qf-round/loving-PG/GloDollar.svg',
	},
	{
		title: '@PublicNouns',
		image: '/images/banners/qf-round/loving-PG/PublicNouns.svg',
	},
	{
		title: '@MUX',
		image: '/images/banners/qf-round/loving-PG/MUX.svg',
	},
	{
		title: '@Giveth',
		image: '/images/banners/qf-round/loving-PG/GivethDonors.svg',
	},
];

// const topSponsors = [
// {
// 	title: '@Arbitrum',
// 	image: '/images/banners/qf-round/sponsor3.svg',
// },
// {
// 	title: '@GloDollar',
// 	image: '/images/banners/qf-round/sponsor6.svg',
// },
// {
// 	title: '@LottoPGF',
// 	image: '/images/banners/qf-round/sponsor7.svg',
// },
// 	{
// 		title: '@Open_Dollar',
// 		image: '/images/banners/qf-round/sponsor8.svg',
// 	},
// ];

// const bottomSponsors = [
// {
// 	title: '@Glodollar',
// 	image: '/images/banners/qf-round/Glodollar.svg',
// },
// {
// 	title: '@OctantApp',
// 	image: '/images/banners/qf-round/OctantApp.svg',
// },
// {
// 	title: '@maearthmedia',
// 	image: '/images/banners/qf-round/maearthmedia.svg',
// },
// {
// 	title: '@RegenToken',
// 	image: '/images/banners/qf-round/regenToken.svg',
// },
// ];
