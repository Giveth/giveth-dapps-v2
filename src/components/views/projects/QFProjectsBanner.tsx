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

export const QFProjectsBanner = () => {
	const [timer, setTimer] = useState(-1000000);
	const { formatMessage } = useIntl();
	const { qfRounds } = useProjectsContext();
	const activeRound = qfRounds.find(round => round.isActive);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!activeRound?.endDate) return;
			const _endDate = new Date(activeRound?.endDate).getTime();
			const diff = _endDate - getNowUnixMS();
			setTimer(diff);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [activeRound?.endDate]);

	return (
		<BannerContainer direction='column'>
			<Image
				src={'/images/banners/qfBanner.png'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Title weight={700}>
				{formatMessage({ id: 'label.quadratic_funding_round' })}{' '}
				{activeRound ? activeRound.id : '--'}
			</Title>
			<Desc>
				<Lead>{formatMessage({ id: 'label.round_ends_in' })}</Lead>
				<B>{activeRound ? durationToString(timer, 3) : '--'}</B>
			</Desc>
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
