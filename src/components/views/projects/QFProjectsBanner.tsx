import { semanticColors, H1, B, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/context/projects.context';
import { BannerContainer } from './ProjectsBanner';
import { Flex } from '@/components/styled-components/Flex';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';

enum ERoundStatus {
	LOADING,
	NOT_STARTED,
	RUNNING,
	ENDED,
	NO_ACTIVE,
}

export const QFProjectsBanner = () => {
	const [state, setState] = useState(ERoundStatus.LOADING);
	const [timer, setTimer] = useState<number | null>(null);
	const { formatMessage } = useIntl();
	const { qfRounds } = useProjectsContext();
	const activeRound = qfRounds.find(round => round.isActive);

	useEffect(() => {
		if (!activeRound) return setState(ERoundStatus.NO_ACTIVE);
		const _startDate = new Date(activeRound?.beginDate).getTime();
		const _endDate = new Date(activeRound?.endDate).getTime();
		const isRoundStarted = getNowUnixMS() > _startDate;
		const isRoundEnded = getNowUnixMS() > _endDate;
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
			setTimer(diff);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [state, activeRound]);

	return (
		<BannerContainer direction='column'>
			<Image
				src={'/images/banners/qfBanner.png'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Title weight={700}>
				{formatMessage({ id: 'label.quadratic_funding' })}
				{activeRound
					? ' - ' +
					  formatMessage({ id: 'label.round' }) +
					  ' ' +
					  activeRound.id
					: null}
			</Title>
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
						{activeRound && timer
							? durationToString(timer, 3)
							: '--'}
					</B>
				</Desc>
			)}
		</BannerContainer>
	);
};

const Title = styled(H1)`
	z-index: 1;
	color: ${semanticColors.golden[500]};
	margin-bottom: 32px;
`;

const Desc = styled(Flex)`
	z-index: 1;
	color: ${semanticColors.jade[100]};
	align-items: center;
	gap: 8px;
`;
