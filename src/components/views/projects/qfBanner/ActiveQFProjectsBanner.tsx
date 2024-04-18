import { B, Lead, Container, Row, H2 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/context/projects.context';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';
import { BannerContainer, StyledCol, Desc, Title, Sponsor } from './common';
import { Flex } from '@/components/styled-components/Flex';

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
	const { qfRounds } = useProjectsContext();
	const activeRound = qfRounds.find(round => round.isActive);

	useEffect(() => {
		if (!activeRound) return setState(ERoundStatus.NO_ACTIVE);
		const _startDate = new Date(activeRound?.beginDate).getTime();
		const _endDate = new Date(activeRound?.endDate).getTime();
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
	}, [activeRound]);

	useEffect(() => {
		let _date: number;
		if (!activeRound) return;
		if (state === ERoundStatus.NOT_STARTED) {
			_date = new Date(activeRound.beginDate).getTime();
		} else if (state === ERoundStatus.RUNNING) {
			_date = new Date(activeRound.endDate).getTime();
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
	}, [state, activeRound]);

	return (
		<BannerContainer>
			<Image
				src={'/images/banners/qf-round/bg.svg'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Container>
				<Row>
					<StyledCol xs={12} md={6}>
						<Title weight={700}>
							{activeRound ? activeRound.name : null}
						</Title>
						<H2>
							{formatMessage({ id: 'label.quadratic_funding' })}
						</H2>
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
									{activeRound && timer && timer > 0
										? durationToString(timer, 3)
										: '--'}
								</B>
							</Desc>
						)}
					</StyledCol>
					<StyledCol
						xs={12}
						md={6}
						style={{ justifyContent: 'center' }}
					>
						<Flex>
							{sponsors.map(s => (
								<Sponsor
									key={s.title}
									src={s.image}
									alt={s.title}
									width={179}
									height={188}
								/>
							))}
						</Flex>
					</StyledCol>
				</Row>
			</Container>
		</BannerContainer>
	);
};

const sponsors = [
	{
		title: '@PublicNouns',
		image: '/images/banners/qf-round/sponsor1.svg',
	},
	{
		title: '@OctantApp',
		image: '/images/banners/qf-round/sponsor2.svg',
	},
	{
		title: '@Arbitrum',
		image: '/images/banners/qf-round/sponsor3.svg',
	},
];
