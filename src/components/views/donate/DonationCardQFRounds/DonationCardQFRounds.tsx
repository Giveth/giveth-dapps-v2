import React, { useEffect, useMemo, useState } from 'react';
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
import { IProject, IQFRound } from '@/apollo/types/types';
import { QFRoundsModal } from '@/components/views/donate/DonationCardQFRounds/QFRoundsModal';
import {
	getActiveQFRounds,
	useFetchQFRoundSmartSelect,
} from '../../donateCause/helpers';

const EmptyRound: IQFRound = {
	id: '',
	name: '',
	slug: '',
	isActive: false,
	beginDate: '',
	endDate: '',
	minimumPassportScore: 0,
	title: '',
	description: '',
	bannerBgImage: '',
	sponsorsImgs: [],
	allocatedFund: 0,
	allocatedFundUSD: 0,
	allocatedFundUSDPreferred: false,
	allocatedTokenSymbol: '',
	allocatedTokenChainId: 0,
	maximumReward: 0,
	eligibleNetworks: [],
	minimumValidUsdValue: 0,
	minMBDScore: 0,
};

export const DonationCardQFRounds = ({
	project,
	chainId,
	selectedQFRound,
	setSelectedQFRound,
}: {
	project: IProject;
	chainId: number;
	selectedQFRound: IQFRound | undefined;
	setSelectedQFRound: (round: IQFRound | undefined) => void;
}) => {
	const { formatMessage } = useIntl();
	const activeQFRounds = useMemo(
		() => getActiveQFRounds(project.qfRounds || []),
		[project.qfRounds],
	);
	const [isSmartSelect, setIsSmartSelect] = useState(false);
	const [showQFRoundModal, setShowQFRoundModal] = useState(false);

	// Fetch QF round smart selection data
	const { data: smartSelectData } = useFetchQFRoundSmartSelect(
		project.id ? parseInt(project.id) : 0,
		chainId,
		!!project.id && !!chainId && activeQFRounds.length > 0,
	);

	// Set up default QF round
	useEffect(() => {
		if (smartSelectData && smartSelectData.qfRoundId) {
			// Find the matching QF round from active rounds
			const matchingRound = activeQFRounds.find(
				round => round.id === smartSelectData.qfRoundId.toString(),
			);
			if (matchingRound) {
				setSelectedQFRound(matchingRound);
			} else {
				// Fallback to first active round
				setSelectedQFRound(activeQFRounds[0] || EmptyRound);
			}
		} else if (
			activeQFRounds.length > 0 &&
			activeQFRounds[0].eligibleNetworks.includes(chainId)
		) {
			// Fallback to first active round if no smart selection and same chain is eligible
			setSelectedQFRound(activeQFRounds[0]);
		} else {
			setSelectedQFRound(EmptyRound);
		}
		setIsSmartSelect(!!smartSelectData);
	}, [activeQFRounds, smartSelectData, chainId, setSelectedQFRound]);

	const handleRoundSelect = (round: IQFRound) => {
		setShowQFRoundModal(true);
		setSelectedQFRound(round);
		setIsSmartSelect(false);
	};

	// Return nothing if there are no QF rounds
	if (!activeQFRounds || activeQFRounds.length === 0) {
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
						<FlexWrapper>
							<RoundName>
								{selectedQFRound && selectedQFRound.name
									? selectedQFRound.name
									: formatMessage({
											id: 'label.qf.select_a_round',
										})}
							</RoundName>
							{selectedQFRound &&
								selectedQFRound.name &&
								isSmartSelect && (
									<SmartSelectBadge>
										{formatMessage({
											id: 'label.qf.smart_select',
										})}
									</SmartSelectBadge>
								)}
						</FlexWrapper>
						<IconWrapper>
							<IconChevronDown24 />
						</IconWrapper>
					</DropdownButton>
				</DropdownContainer>
			</Container>
			{showQFRoundModal && (
				<QFRoundsModal
					QFRounds={activeQFRounds}
					setShowModal={setShowQFRoundModal}
					project={project}
					selectedRound={selectedQFRound}
					onRoundSelect={handleRoundSelect}
					chainId={chainId}
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
