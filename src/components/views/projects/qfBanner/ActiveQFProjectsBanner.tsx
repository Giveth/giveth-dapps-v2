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
import { IQFRound } from '@/apollo/types/types';
import { getQFRoundImage } from '@/lib/helpers/qfroundHelpers';
import useDetectDevice from '@/hooks/useDetectDevice';

enum ERoundStatus {
	LOADING,
	NOT_STARTED,
	RUNNING,
	ENDED,
	NO_ACTIVE,
}

export const ActiveQFProjectsBanner = ({
	qfRound,
}: { qfRound?: IQFRound } = {}) => {
	const { isMobile } = useDetectDevice();

	const [state, setState] = useState(ERoundStatus.LOADING);
	const [timer, setTimer] = useState<number | null>(null);
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);

	// Use prop qfRound if provided, otherwise fall back to activeQFRound from state
	const currentRound = qfRound || activeQFRound;

	// Image format is being bad formatted so managing locally instead
	useEffect(() => {
		if (!currentRound) return setState(ERoundStatus.NO_ACTIVE);
		const _startDate = new Date(currentRound?.beginDate).getTime();
		const _endDate = new Date(currentRound?.endDate).getTime();
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
	}, [currentRound]);

	useEffect(() => {
		let _date: number;
		if (!currentRound) return;
		if (state === ERoundStatus.NOT_STARTED) {
			_date = new Date(currentRound.beginDate).getTime();
		} else if (state === ERoundStatus.RUNNING) {
			_date = new Date(currentRound.endDate).getTime();
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
	}, [state, currentRound]);

	return (
		<BannerContainer>
			{currentRound && (
				<Image
					src={getQFRoundImage(currentRound, isMobile ?? false)}
					style={{ objectFit: 'cover' }}
					fill
					alt='QF Banner'
				/>
			)}
			<Container>
				<ActiveStyledRow>
					<ActiveStyledCol xs={12} md={6}>
						<TitleWrapper weight={700}>
							{currentRound ? currentRound.name : null}
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
									{currentRound && timer && timer > 0
										? durationToString(timer, 3)
										: '--'}
								</B>
							</DescWrapper>
						)}
					</ActiveStyledCol>
				</ActiveStyledRow>
			</ContainerWrapper>
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

	${mediaQueries.tablet} {
		height: 100%;
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
