import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
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
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const [currentSelected, setCurrentSelected] = useState<IQFRound | null>(
		selectedRound || null,
	);

	const handleRoundSelect = (round: IQFRound) => {
		setCurrentSelected(round);
		onRoundSelect?.(round);
		closeModal();
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getNetworkIcons = (eligibleNetworks: number[]) => {
		// Mock network icons - replace with actual network icon mapping
		const networkIconMap: { [key: number]: string } = {
			1: '🔷', // Ethereum
			10: '🔴', // Optimism
			42161: '🔵', // Arbitrum
			8453: '🟦', // Base
			100: '🟢', // Gnosis
			137: '🟣', // Polygon
		};

		return eligibleNetworks.map(networkId => (
			<NetworkIcon key={networkId}>
				{networkIconMap[networkId] || '🌐'}
			</NetworkIcon>
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
						<ProjectName>&lt;{project.title}&gt;</ProjectName> is in{' '}
						<RoundCount>&lt; x &gt;</RoundCount> QF round(s). Select
						the round you want to donate in.
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
										<SelectedBadge>Selected</SelectedBadge>
									)}
								</RoundHeader>

								<RoundInfo>
									<InfoRow>
										<InfoLabel>Matching Pool</InfoLabel>
										<InfoValue>
											{formatCurrency(
												round.allocatedFundUSD,
											)}
										</InfoValue>
									</InfoRow>

									<InfoRow>
										<InfoLabel>Eligible Networks</InfoLabel>
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
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	text-align: center;
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
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 16px;
	max-width: 100%;
`;

const RoundCard = styled.div<{ $isSelected: boolean }>`
	padding: 20px;
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
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
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
	justify-content: space-between;
	align-items: center;
`;

const InfoLabel = styled(SublineBold)`
	color: ${neutralColors.gray[600]};
`;

const InfoValue = styled(SublineBold)`
	color: ${neutralColors.gray[900]};
`;

const NetworkIcons = styled(Flex)`
	gap: 4px;
	align-items: center;
`;

const NetworkIcon = styled.span`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	background: ${neutralColors.gray[100]};
`;
