import React, { useState } from 'react';
import styled from 'styled-components';
import {
	B,
	P,
	neutralColors,
	Flex,
	IconChevronDown24,
	IconChevronUp24,
	brandColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { IProject } from '@/apollo/types/types';
import { QFRoundsModal } from '@/components/views/donate/DonationCardQFRounds/QFRoundsModal';

export interface IQFRound {
	id: string;
	name: string;
	isActive: boolean;
	beginDate: string;
	endDate: string;
	maximumReward: number;
	allocatedTokenSymbol: string;
	allocatedFundUSDPreferred: boolean;
	allocatedFundUSD: number;
	eligibleNetworks: number[];
}

export const DonationCardQFRounds = ({ project }: { project: IProject }) => {
	const { formatMessage } = useIntl();
	console.log('project', project.qfRounds?.[0]);
	const [selectedRound, setSelectedRound] = useState<IQFRound>(
		project.qfRounds?.[0] || {
			id: '',
			name: '',
			isActive: false,
			beginDate: '',
			endDate: '',
			maximumReward: 0,
			allocatedTokenSymbol: '',
			allocatedFundUSDPreferred: false,
			allocatedFundUSD: 0,
			eligibleNetworks: [],
		},
	);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showQFRoundModal, setShowQFRoundModal] = useState(false);

	const handleRoundSelect = (round: IQFRound) => {
		setShowQFRoundModal(true);
		setSelectedRound(round);
	};

	// Return nothing if there are no QF rounds
	if (!project.qfRounds || project.qfRounds.length === 0) {
		return null;
	}

	return (
		<>
			<Container>
				<Title>
					{formatMessage({ id: 'label.qf.select_qf_round' })}
				</Title>
				<DropdownContainer>
					<DropdownButton onClick={() => setShowQFRoundModal(true)}>
						<Flex $alignItems='center' $gap='8px'>
							<RoundName>{selectedRound.name}</RoundName>
							<SmartSelectBadge>Smart Select</SmartSelectBadge>
						</Flex>
						<IconWrapper>
							<IconChevronDown24 />
						</IconWrapper>
					</DropdownButton>
				</DropdownContainer>
			</Container>
			{showQFRoundModal && (
				<QFRoundsModal
					QFRounds={project.qfRounds}
					setShowModal={setShowQFRoundModal}
				/>
			)}
		</>
	);
};

const Container = styled.div`
	margin-bottom: 24px;
`;

const Title = styled(B)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 16px;
	display: block;
`;

const DropdownContainer = styled.div`
	position: relative;
	width: 100%;
`;

const DropdownButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px;
	background: white;
	border: 1px solid ${neutralColors.gray[400]};
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${brandColors.giv[500]};
	}
`;

const RoundName = styled(P)`
	font-weight: 600;
	color: ${neutralColors.gray[900]};
`;

const SmartSelectBadge = styled.span`
	background: ${brandColors.cyan[500]};
	color: white;
	padding: 4px 8px;
	border-radius: 6px;
	font-size: 12px;
	font-weight: 500;
`;

const IconWrapper = styled.div`
	width: 24px;
	height: 24px;
	color: ${neutralColors.gray[600]};
`;
