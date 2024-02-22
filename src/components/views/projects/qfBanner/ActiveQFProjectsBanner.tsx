import { B, Lead, Container, Row } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/context/projects.context';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';
import {
	BannerContainer,
	ImgTopRight,
	ImgBottomRight,
	ImgTopLeft,
	ImgBottomLeft,
	StyledCol,
	Name,
	Desc,
	Title,
	ImgBottomLeft1,
	ImgMiddleRight,
	ImgTopMiddle,
	ImgTopRight1,
	Sponsor,
} from './common';

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
			<ImgMiddleRight
				src={'/images/banners/qf-round/mr.svg'}
				style={{ objectFit: 'cover' }}
				alt='Middle Right'
			/>
			<ImgTopRight
				src={'/images/banners/qf-round/tr1.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgTopRight1
				src={'/images/banners/qf-round/tr2.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgTopMiddle
				src={'/images/banners/qf-round/tm.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgBottomRight
				src={'/images/banners/qf-round/br.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgTopLeft
				src={'/images/banners/qf-round/tl.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgBottomLeft
				src={'/images/banners/qf-round/bl1.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgBottomLeft1
				src={'/images/banners/qf-round/bl2.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<Container>
				<Row>
					<StyledCol xs={12} md={6}>
						<Title weight={700}>
							{formatMessage({ id: 'label.quadratic_funding' })}
						</Title>
						<Name>{activeRound ? activeRound.name : null}</Name>
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
					<StyledCol xs={12} md={6}>
						<Sponsor
							src={'/images/banners/qf-round/sponsor.svg'}
							style={{ objectFit: 'contain' }}
							alt='QF Banner'
						/>
					</StyledCol>
				</Row>
			</Container>
		</BannerContainer>
	);
};
