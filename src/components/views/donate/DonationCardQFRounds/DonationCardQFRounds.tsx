import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	P,
	neutralColors,
	semanticColors,
	Flex,
	IconChevronDown24,
	brandColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { IProject } from '@/apollo/types/types';
import { QFRoundsModal } from '@/components/views/donate/DonationCardQFRounds/QFRoundsModal';
import { smartQFRoundSelection } from '../../donateCause/helpers';

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

export const DonationCardQFRounds = ({
	project,
	chainId,
}: {
	project: IProject;
	chainId: number;
}) => {
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

	// Set up default QF round
	useEffect(() => {
		const smartRound = smartQFRoundSelection(
			project.qfRounds || [],
			chainId,
		);
		if (smartRound) {
			setSelectedRound(smartRound);
		}
	}, [project.qfRounds, chainId]);

	const [showQFRoundModal, setShowQFRoundModal] = useState(false);

	const handleRoundSelect = (round: IQFRound) => {
		setShowQFRoundModal(true);
		setSelectedRound(round);
	};

	// Return nothing if there are no QF rounds
	if (!project.qfRounds || project.qfRounds.length === 0) {
		return null;
	}

	console.log('selectedRound', selectedRound);

	return (
		<>
			<Container>
				<Title>
					{formatMessage({ id: 'label.qf.select_qf_round' })}
				</Title>
				<DropdownContainer>
					<DropdownButton onClick={() => setShowQFRoundModal(true)}>
						<FlexWrapper>
							<RoundName>
								{selectedRound
									? selectedRound.name
									: 'No QF round found'}
							</RoundName>
							<SmartSelectBadge>Smart Select</SmartSelectBadge>
						</FlexWrapper>
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

const FlexWrapper = styled(Flex)`
	align-items: center;
	gap: 8px;
`;

const RoundName = styled(P)`
	font-weight: 600;
	color: ${neutralColors.gray[900]};
`;

const SmartSelectBadge = styled.span`
	background: ${semanticColors.jade[200]};
	color: ${semanticColors.jade[700]};
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
