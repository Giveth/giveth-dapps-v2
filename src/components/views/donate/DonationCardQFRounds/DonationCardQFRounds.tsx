import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useSwitchChain } from 'wagmi';
import { useWeb3ModalEvents } from '@web3modal/wagmi/react';
import { IProject, IQFRound } from '@/apollo/types/types';
import { QFRoundsModal } from '@/components/views/donate/DonationCardQFRounds/QFRoundsModal';
import {
	getActiveQFRounds,
	useFetchQFRoundSmartSelect,
} from '../../donateCause/helpers';
import config from '@/configuration';

// Add text truncation utility function
const truncateText = (text: string, maxLength: number = 50) => {
	if (!text) return '';
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

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
	choosedModalRound,
	setChoosedModalRound,
	isQRDonation,
}: {
	project: IProject;
	chainId: number;
	selectedQFRound: IQFRound | undefined;
	setSelectedQFRound: (round: IQFRound | undefined) => void;
	choosedModalRound: IQFRound | undefined;
	setChoosedModalRound: (round: IQFRound | undefined) => void;
	isQRDonation?: boolean;
}) => {
	const { status } = useSwitchChain();
	const { formatMessage } = useIntl();
	const activeQFRounds = useMemo(() => {
		let rounds = getActiveQFRounds(project.qfRounds || []);

		// Filter for Stellar network if it's QR donation
		if (isQRDonation) {
			rounds = rounds.filter(round =>
				round.eligibleNetworks.includes(config.STELLAR_NETWORK_NUMBER),
			);
		}

		// Truncate round names
		return rounds.map(round => ({
			...round,
			name: truncateText(round.name, 20),
		}));
	}, [project.qfRounds, isQRDonation]);

	const [isSmartSelect, setIsSmartSelect] = useState(false);
	const [showQFRoundModal, setShowQFRoundModal] = useState(false);

	// Fetch QF round smart selection data
	const { data: smartSelectData } = useFetchQFRoundSmartSelect(
		project.id ? parseInt(project.id) : 0,
		isQRDonation ? config.STELLAR_NETWORK_NUMBER : chainId,
		!!project.id && !!chainId && activeQFRounds.length > 0,
	);

	const handleRoundSelect = (round: IQFRound) => {
		setSelectedQFRound(round);
		setIsSmartSelect(false);
		setShowQFRoundModal(false);
	};

	// Track state between open and close - user changed network using wagmi modal
	const { data: web3ModalData } = useWeb3ModalEvents();
	const modalOpen = useRef(false);
	const initialChainId = useRef<number | null>(null);

	useEffect(() => {
		if (web3ModalData?.event === 'MODAL_OPEN' && !modalOpen.current) {
			modalOpen.current = true;
			initialChainId.current = chainId;
		}

		if (web3ModalData?.event === 'MODAL_CLOSE') {
			modalOpen.current = false;
			if (
				initialChainId.current !== null &&
				initialChainId.current !== chainId
			) {
				setChoosedModalRound(undefined);
			}
			initialChainId.current = null;
		}
	}, [web3ModalData, chainId]);

	// Set up default QF round
	useEffect(() => {
		// This option is seelcted by user inside modal and after he changed network we should use this option
		if (choosedModalRound) {
			setSelectedQFRound(choosedModalRound);
			return;
		}

		// This option is fired when user get on the page or change network inside wallet
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
	}, [
		activeQFRounds,
		smartSelectData,
		chainId,
		setSelectedQFRound,
		choosedModalRound,
	]);

	// Return nothing if there are no QF rounds
	if (!activeQFRounds || activeQFRounds.length === 0) {
		return null;
	}

	// If it is stellar donation and there is no active round with stellar, return null
	if (isQRDonation && activeQFRounds.length > 0) {
		const stellarRound = activeQFRounds.find(round =>
			round.eligibleNetworks.includes(config.STELLAR_NETWORK_NUMBER),
		);
		if (!stellarRound) {
			return null;
		}
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
					setChoosedModalRound={setChoosedModalRound}
					isQRDonation={isQRDonation}
				/>
			)}
		</>
	);
};

const Container = styled.div`
	width: 100%;
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
