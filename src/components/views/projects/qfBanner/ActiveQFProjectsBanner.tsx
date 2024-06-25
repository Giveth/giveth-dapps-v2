import { B, Lead, Container, Row } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';
import {
	BannerContainer,
	ActiveStyledCol,
	Desc,
	Title,
	Sponsor,
	SmallerSponsor,
	BottomSponsors,
	MiddleSponsors,
} from './common';
import { useAppSelector } from '@/features/hooks';

enum ERoundStatus {
	LOADING,
	NOT_STARTED,
	RUNNING,
	ENDED,
	NO_ACTIVE,
}

export const ActiveQFProjectsBanner = () => {
	const [state, setState] = useState(ERoundStatus.LOADING);
	const [timer, setTimer] = useState<number | null>(null);
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);

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
					activeQFRound?.bannerBgImage ||
					'/images/banners/qf-round/bg.svg'
				}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Container>
				<Row>
					<ActiveStyledCol xs={12} md={6}>
						<Title weight={700}>
							{activeQFRound ? activeQFRound.name : null}
						</Title>
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
						{/*<Flex>*/}
						{/*	{topSponsors.map(s => (*/}
						{/*		<SmallerSponsor*/}
						{/*			key={s.title}*/}
						{/*			src={s.image}*/}
						{/*			alt={s.title}*/}
						{/*			width={120}*/}
						{/*			height={120}*/}
						{/*		/>*/}
						{/*	))}*/}
						{/*</Flex>*/}
						<MiddleSponsors>
							{sponsors.map(s => (
								<Sponsor
									key={s.title}
									src={s.image}
									alt={s.title}
									width={179}
									height={188}
								/>
							))}
						</MiddleSponsors>
						<BottomSponsors>
							{bottomSponsors.map(s => (
								<SmallerSponsor
									key={s.title}
									src={s.image}
									alt={s.title}
									width={120}
									height={120}
								/>
							))}
						</BottomSponsors>
					</ActiveStyledCol>
				</Row>
			</Container>
		</BannerContainer>
	);
};

const sponsors = [
	{
		title: '@publicNouns',
		image: '/images/banners/qf-round/publicNouns.svg',
	},
	{
		title: '@climate_program',
		image: '/images/banners/qf-round/climate_program.svg',
	},
	{
		title: '@celo',
		image: '/images/banners/qf-round/celo.svg',
	},
	{
		title: '@realMaskNetwork',
		image: '/images/banners/qf-round/realMaskNetwork.svg',
	},
];

const topSponsors = [
	{
		title: '@Arbitrum',
		image: '/images/banners/qf-round/sponsor3.svg',
	},
	{
		title: '@GloDollar',
		image: '/images/banners/qf-round/sponsor6.svg',
	},
	{
		title: '@LottoPGF',
		image: '/images/banners/qf-round/sponsor7.svg',
	},
	{
		title: '@Open_Dollar',
		image: '/images/banners/qf-round/sponsor8.svg',
	},
];

const bottomSponsors = [
	{
		title: '@Glodollar',
		image: '/images/banners/qf-round/Glodollar.svg',
	},
	{
		title: '@OctantApp',
		image: '/images/banners/qf-round/OctantApp.svg',
	},
	{
		title: '@RegenToken',
		image: '/images/banners/qf-round/regenToken.svg',
	},
];
