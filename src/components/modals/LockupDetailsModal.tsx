import {
	neutralColors,
	brandColors,
	Button,
	IconRocketInSpace32,
	IconArrowLeft,
	IconHelp,
	IconUnlock32,
	H5,
	H6,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { IconWithTooltip } from '../IconWithToolTip';

export const LockupDetailsModal: FC<IModal> = ({ setShowModal }) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerTitle='Lockup Details'
			headerTitlePosition='left'
			headerIcon={<IconRocketInSpace32 />}
		>
			<LockupDetailsContainer>
				<Desc>
					Review your staked GIV, lockup periods, multipliers &amp;
					earnings.
				</Desc>
				<Subtitle>Available to unstake</Subtitle>
				<UnstakeContainer>
					<div>
						<IconUnlock32 />
						<CloseText>
							<Subtitle>150</Subtitle>
							<H6>GIV</H6>
						</CloseText>
					</div>
					<div>
						<H6>10%</H6>
						<CloseText>
							<H6>APR</H6>
							<IconWithTooltip
								icon={<IconHelp />}
								direction='top'
							>
								<H6>APR</H6>
							</IconWithTooltip>
						</CloseText>
					</div>
				</UnstakeContainer>

				<LockedContainer>
					<Subtitle>Locked GIV</Subtitle>
				</LockedContainer>

				<StakedContainer>
					<SubtitleWithTooltip>
						<Subtitle>Total staked GIV</Subtitle>
						<IconWithTooltip icon={<IconHelp />} direction='top'>
							<H6>some explanation here</H6>
						</IconWithTooltip>
					</SubtitleWithTooltip>

					<TotalContainer>
						<SubtitleH5>150</SubtitleH5>
						<H6>GIV</H6>
					</TotalContainer>
				</StakedContainer>
			</LockupDetailsContainer>
		</Modal>
	);
};

const LockupDetailsContainer = styled.div`
	padding: 24px 32px 24px;
	background-repeat: no-repeat;
	width: 552px;
	color: ${neutralColors.gray[100]};
	text-align: left;
`;

const Desc = styled(H6)`
	margin: 0 0 24px 0;
`;

const BlueContainer = styled(Flex)`
	background-color: ${brandColors.giv[500]};
	text-align: center;
	padding: 18.5px;
	margin: 0 0 24px 0;
	border-radius: 16px;
`;

const UnstakeContainer = styled(BlueContainer)`
	display: flex;
	justify-content: space-between;
	margin: 24px 0 0 0;
	div {
		display: flex;
		align-items: center;
		gap: 14px;
	}
`;

const CloseText = styled.div`
	gap: 4px !important;
`;

const LockedContainer = styled.div`
	margin: 24px 0 0 0;
`;

const StakedContainer = styled.div`
	margin: 24px 0;
`;

const TotalContainer = styled(BlueContainer)`
	display: flex;
	justify-content: center;
	margin: 24px 0 0 0;
	gap: 4px;
	align-items: center;
`;

const Subtitle = styled(H6)`
	font-weight: 700;
`;

const SubtitleWithTooltip = styled(Subtitle)`
	display: flex;
	flex-direction: row;
	gap: 4px;
`;

const SubtitleH5 = styled(H5)`
	font-weight: 700;
`;
