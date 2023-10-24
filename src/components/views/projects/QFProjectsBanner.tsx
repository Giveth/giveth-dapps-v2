import {
	H1,
	B,
	Lead,
	Container,
	Row,
	H2,
	Col,
	deviceSize,
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
				src={'/images/banners/qfBannerOP.png'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<OPItem1
				src={'/images/banners/optimism/op_giv_1.png'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<OPItem2
				src={'/images/banners/optimism/op_giv_2.png'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<OPItem3
				src={'/images/banners/optimism/op_giv_3.png'}
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
						<Image
							src={'/images/banners/qfSponsorsOP.png'}
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
	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}
`;

const StyledCol = styled(Col)`
	position: relative;
	display: flex;
	flex-direction: column;
	z-index: 1;
	min-height: 300px;
	text-align: left;
	align-items: flex-start;

	@media (max-width: ${deviceSize.laptopS}px) {
		text-align: center;
		align-items: center;
	}
`;

const Title = styled(H1)`
	margin-top: 32px;
	color: #fff;
`;

const Name = styled(H2)`
	color: #fff;
`;

const Desc = styled(Flex)`
	width: fit-content;
	color: #fff;
	border: 2px solid #fff;
	border-radius: 48.202px;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 9px 20px;
	background: #e11527;
	margin-top: 12px;
	margin-bottom: 32px;
`;

const OPItem = styled.img`
	z-index: 2;
	position: absolute;
	width: 177px;
	@media (max-width: ${deviceSize.laptopS}px) {
		display: none;
	}
`;
const OPItem1 = styled(OPItem)`
	top: 0;
	left: 30%;
`;
const OPItem2 = styled(OPItem)`
	left: 20%;
	bottom: 0;
`;
const OPItem3 = styled(OPItem)`
	width: 104px;
	left: 0;
	@media (max-width: ${deviceSize.desktop}px) {
		display: none;
	}
`;
