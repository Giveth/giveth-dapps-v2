import React, { useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import {
	B,
	P,
	neutralColors,
	Flex,
	SublineBold,
	brandColors,
} from '@giveth/ui-design-system';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IQFRound } from '@/components/views/donate/DonationCardQFRounds/DonationCardQFRounds';
import { IProject } from '@/apollo/types/types';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import config from '@/configuration';
import { formatDonation } from '@/helpers/number';

interface IQFRoundModalProps extends IModal {
	QFRounds: IQFRound[];
	setShowModal: (show: boolean) => void;
	project: IProject;
	onRoundSelect?: (round: IQFRound) => void;
	selectedRound?: IQFRound;
}

export const QFRoundsModal = ({
	QFRounds,
	setShowModal,
	project,
	onRoundSelect,
	selectedRound,
}: IQFRoundModalProps) => {
	const { formatMessage, locale } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [currentSelected, setCurrentSelected] = useState<IQFRound | null>(
		selectedRound || null,
	);

	const handleRoundSelect = (round: IQFRound) => {
		setCurrentSelected(round);
		onRoundSelect?.(round);
		closeModal();
	};

	const getNetworkIcons = (eligibleNetworks: number[]) => {
		console.log('eligibleNetworks', eligibleNetworks);
		return eligibleNetworks.map(networkId => (
			<IconWithTooltip
				icon={
					<TooltipIconWrapper>
						{config.NETWORKS_CONFIG_WITH_ID[networkId]?.chainLogo(
							24,
						)}
					</TooltipIconWrapper>
				}
				direction='top'
				align='top'
				key={networkId}
			>
				<SublineBold>
					{config.NETWORKS_CONFIG_WITH_ID[networkId]?.name}
				</SublineBold>
			</IconWithTooltip>
		));
	};

	return (
		<>
			<Modal
				closeModal={closeModal}
				isAnimating={isAnimating}
				headerTitlePosition='left'
				headerTitle={formatMessage({ id: 'label.qf.select_qf_round' })}
			>
				<ModalContent>
					<Description>
						<FormattedMessage
							id='label.qf.project_in_round'
							values={{
								project: () => (
									<ProjectName>{project.title}</ProjectName>
								),
								number: () => (
									<RoundCount>{QFRounds.length}</RoundCount>
								),
							}}
						/>
					</Description>

					<RoundsGrid>
						{QFRounds.map(round => (
							<RoundCard
								key={round.id}
								onClick={() => handleRoundSelect(round)}
								$isSelected={currentSelected?.id === round.id}
							>
								<RoundHeader>
									<RoundTitle>{round.name}</RoundTitle>
									{currentSelected?.id === round.id && (
										<SelectedBadge>
											{formatMessage({
												id: 'label.selected',
											})}
										</SelectedBadge>
									)}
								</RoundHeader>

								<RoundInfo>
									<InfoRow>
										<InfoLabel>
											{formatMessage({
												id: 'label.matching_pool',
											})}
										</InfoLabel>
										<InfoValue>
											{formatDonation(
												round.allocatedFundUSD,
												'$',
												locale,
											)}
										</InfoValue>
									</InfoRow>

									<InfoRow>
										<InfoLabel>
											{formatMessage({
												id: 'label.qf.eligible_networks',
											})}
										</InfoLabel>
										<NetworkIcons>
											{getNetworkIcons(
												round.eligibleNetworks,
											)}
										</NetworkIcons>
									</InfoRow>
								</RoundInfo>
							</RoundCard>
						))}
					</RoundsGrid>
				</ModalContent>
			</Modal>
		</>
	);
};

const ModalContent = styled.div`
	padding: 0 24px 24px;
	max-height: 70vh;
	overflow-y: auto;
`;

const Description = styled(P)`
	margin-top: 4px;
	padding: 30px 0 15px 0;
	border-top: 1px solid ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	text-align: left;
`;

const ProjectName = styled.span`
	color: ${neutralColors.gray[900]};
	font-weight: 600;
`;

const RoundCount = styled.span`
	color: ${neutralColors.gray[900]};
	font-weight: 600;
`;

const RoundsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
	gap: 16px;
	max-width: calc(380px * 3 + 32px); /* 3 cols + gaps */
`;

const RoundCard = styled.div<{ $isSelected: boolean }>`
	padding: 12px;
	border: 1px solid
		${props =>
			props.$isSelected ? brandColors.giv[500] : neutralColors.gray[300]};
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.2s ease;
	background: ${props => (props.$isSelected ? brandColors.giv[50] : 'white')};

	&:hover {
		border-color: ${brandColors.giv[500]};
		background: ${brandColors.giv[100]};
	}
`;

const RoundHeader = styled.div`
	padding: 0 0 6px 0;
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	text-align: left;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const RoundTitle = styled(B)`
	color: ${neutralColors.gray[900]};
	flex: 1;
`;

const SelectedBadge = styled.span`
	background: ${brandColors.giv[500]};
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
	margin-left: 8px;
`;

const RoundInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const InfoRow = styled(Flex)`
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
`;

const InfoLabel = styled(SublineBold)`
	color: ${neutralColors.gray[600]};
	font-size: 16px;
	font-weight: 400;
`;

const InfoValue = styled(B)`
	color: ${neutralColors.gray[900]};
	font-size: 16px;
`;

const NetworkIcons = styled(Flex)`
	width: 100%;
	margin-top: 4px;
	display: flex;
	flex-wrap: wrap;
	max-width: 100%;
	max-height: 100%;
`;

const TooltipIconWrapper = styled.div`
	margin-right: 4px;
	filter: grayscale(100%);

	&:hover {
		filter: grayscale(0%);
	}
`;
