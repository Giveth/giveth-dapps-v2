import {
	semanticColors,
	H1,
	B,
	Lead,
	Container,
	Row,
	H2,
	Col,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/context/projects.context';
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
				src={'/images/banners/qfBanner.webp'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
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
						<Image
							src={'/images/banners/qfSponsors.png'}
							style={{ objectFit: 'contain' }}
							fill
							alt='QF Banner'
						/>
					</StyledCol>
				</Row>
			</Container>
		</BannerContainer>
	);
};

const BannerContainer = styled.div`
	position: relative;
	padding-top: 100px;
	padding-bottom: 100px;
`;

const StyledCol = styled(Col)`
	position: relative;
	z-index: 1;
	min-height: 300px;
	text-align: center;
	${mediaQueries.laptopS} {
		text-align: left;
	}
`;

const Title = styled(H1)`
	margin-top: 32px;
	color: ${semanticColors.golden[500]};
`;

const Name = styled(H2)`
	color: ${semanticColors.golden[500]};
`;

const Desc = styled(Flex)`
	color: ${semanticColors.jade[100]};
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-bottom: 32px;
	${mediaQueries.laptopS} {
		justify-content: left;
	}
`;
