import {
	B,
	Lead,
	Container,
	Flex,
	Row,
	Col,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';
import { Desc, Title } from './common';
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

	// Image format is being bad formatted so managing locally instead
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
				<ActiveStyledRow>
					<ActiveStyledCol xs={12} md={6}>
						<TitleWrapper weight={700}>
							{activeQFRound ? activeQFRound.name : null}
						</TitleWrapper>
						{(state === ERoundStatus.NOT_STARTED ||
							state === ERoundStatus.RUNNING) && (
							<DescWrapper>
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
							</DescWrapper>
						)}
					</ActiveStyledCol>
				</ActiveStyledRow>
			</Container>
		</BannerContainer>
	);
};

export const BannerContainer = styled(Flex)`
	position: relative;
	overflow: hidden;
	align-items: start !important;
	border-radius: 16px;
	${mediaQueries.tablet} {
		height: 220px;
	}
`;

export const ActiveStyledRow = styled(Row)`
	padding-top: 10px;
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

const DescWrapper = styled(Desc)`
	font-size: 16px;
	background: ${brandColors.giv[500]};
	border-color: ${neutralColors.gray[100]};
	color: ${neutralColors.gray[100]};
`;

const TitleWrapper = styled(Title)`
	font-weight: 700;
	font-size: 32px;
`;

export const Sponsor = styled(Image)`
	width: 85px;
	height: 95px;
`;
