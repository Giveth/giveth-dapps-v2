import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
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
import { useWeb3ModalEvents } from '@web3modal/wagmi/react';
import router from 'next/router';
import { IProject, IQFRound } from '@/apollo/types/types';
import { QFRoundsModal } from '@/components/views/donate/DonationCardQFRounds/QFRoundsModal';
import {
	getActiveQFRounds,
	useFetchQFRoundSmartSelect,
} from '../../donateCause/helpers';
import config from '@/configuration';
import { hasStellarAddress, isStellarOnlyRound } from '@/helpers/qf';

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
	onStellarDonation,
}: {
	project: IProject;
	chainId: number;
	selectedQFRound: IQFRound | undefined;
	setSelectedQFRound: (round: IQFRound | undefined) => void;
	choosedModalRound: IQFRound | undefined;
	setChoosedModalRound: (round: IQFRound | undefined) => void;
	isQRDonation?: boolean;
	onStellarDonation?: () => void;
}) => {
	const didRunRef = useRef(false);
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
		return rounds;
	}, [project.qfRounds, isQRDonation]);

	const projectHasStellarAddress = hasStellarAddress(project.addresses);

	// Stellar is not a wallet network: a Stellar-only round must open the
	// Stellar (QR) donate flow directly. Only flows that can open it
	// qualify: the QR flow itself, or a caller providing onStellarDonation
	// (the cause flow provides neither).
	const opensStellarFlow = useCallback(
		(round: IQFRound) =>
			isStellarOnlyRound(round) &&
			projectHasStellarAddress &&
			(!!isQRDonation || !!onStellarDonation),
		[projectHasStellarAddress, isQRDonation, onStellarDonation],
	);

	// Networks the switch-network modal can act on for a round: eligible
	// for the round, accepted by the project, and — for Stellar — only
	// when the caller can open the Stellar (QR) flow. Stellar addresses are
	// identified by chainType (their networkId is not guaranteed); other
	// networks match by networkId.
	const getSwitchableNetworks = useCallback(
		(round: IQFRound) => {
			const projectAcceptedChains = project.addresses?.map(
				address => address.networkId,
			);
			return round.eligibleNetworks.filter(network =>
				network === config.STELLAR_NETWORK_NUMBER
					? projectHasStellarAddress && !!onStellarDonation
					: projectAcceptedChains?.includes(network),
			);
		},
		[project.addresses, projectHasStellarAddress, onStellarDonation],
	);

	// Rounds this flow has a route to donate to — the single source of
	// truth for the default-round selection and the picker modal alike.
	const selectableRounds = useMemo(
		() =>
			activeQFRounds.filter(
				round =>
					opensStellarFlow(round) ||
					(isQRDonation &&
						round.eligibleNetworks.includes(
							config.STELLAR_NETWORK_NUMBER,
						)) ||
					round.eligibleNetworks.includes(chainId) ||
					getSwitchableNetworks(round).length > 0,
			),
		[
			activeQFRounds,
			opensStellarFlow,
			getSwitchableNetworks,
			isQRDonation,
			chainId,
		],
	);

	// Default-selection candidates: selectable rounds the regular one-time
	// flow can donate to with a connected wallet — Stellar-only rounds are
	// excluded (they are donated to via the Stellar QR flow, which the
	// round selector routes to on pick).
	const walletEligibleRounds = useMemo(
		() => selectableRounds.filter(round => !isStellarOnlyRound(round)),
		[selectableRounds],
	);

	const [isSmartSelect, setIsSmartSelect] = useState(false);
	const [showQFRoundModal, setShowQFRoundModal] = useState(false);

	// Fetch QF round smart selection data
	// Stellar (QR) donations are not tied to a connected EVM chain, so enable
	// the query using the Stellar network number rather than requiring chainId.
	const { data: smartSelectData, isFetching: isFetchingSmartSelect } =
		useFetchQFRoundSmartSelect(
			project.id ? parseInt(project.id) : 0,
			isQRDonation ? config.STELLAR_NETWORK_NUMBER : chainId,
			!!project.id &&
				(isQRDonation || !!chainId) &&
				selectableRounds.length > 0,
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
	// Last chainId the default-round effect observed, used to detect an
	// actual network change (including in-wallet switches that bypass the
	// web3modal) so a stale pin can be released.
	const prevChainId = useRef(chainId);

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
		// Detect an actual network change since the last run (an in-wallet
		// switch updates chainId without firing a web3modal event).
		const chainChanged = prevChainId.current !== chainId;
		prevChainId.current = chainId;

		// Stellar (QR) flow: the round is dictated by the flow itself —
		// selectableRounds is already reduced to Stellar-eligible rounds, so
		// select one immediately instead of waiting for smart select or
		// depending on the connected wallet's chain. A round the user picked
		// in the modal wins; the smart-select result upgrades the default.
		if (isQRDonation) {
			const pinnedRound =
				choosedModalRound &&
				selectableRounds.find(
					round => round.id === choosedModalRound.id,
				);
			const smartRound = smartSelectData?.qfRoundId
				? selectableRounds.find(
						round =>
							round.id === smartSelectData.qfRoundId.toString(),
					)
				: undefined;
			setSelectedQFRound(
				pinnedRound || smartRound || selectableRounds[0] || EmptyRound,
			);
			setIsSmartSelect(!pinnedRound && !!smartRound);
			return;
		}

		// When the donor backs out of the Stellar (QR) flow with a pinned
		// Stellar-only round, drop the pin so eligibility is recomputed for
		// the connected chain and donating on the project's other networks
		// works.
		if (isStellarOnlyRound(choosedModalRound)) {
			setChoosedModalRound(undefined);
			return;
		}

		// The wallet switched to a network the pinned round is not eligible
		// for (e.g. an in-wallet network change that bypasses the web3modal):
		// drop the pin so an eligible round is recomputed for the new chain.
		// Only on an actual change — the switch-network modal pins a round for
		// the chain it is switching *to*, before chainId has caught up.
		if (
			choosedModalRound &&
			chainChanged &&
			!!chainId &&
			!choosedModalRound.eligibleNetworks.includes(chainId)
		) {
			setChoosedModalRound(undefined);
			return;
		}

		// This option is seelcted by user inside modal and after he changed network we should use this option
		if (choosedModalRound) {
			setSelectedQFRound(choosedModalRound);
			return;
		}

		// This option is fired when user get on the page or change network inside wallet
		if (smartSelectData && smartSelectData.qfRoundId) {
			// Find the matching QF round among the wallet-donatable rounds
			const matchingRound = walletEligibleRounds.find(
				round => round.id === smartSelectData.qfRoundId.toString(),
			);
			if (matchingRound) {
				setSelectedQFRound(matchingRound);
				setIsSmartSelect(true);
			} else {
				setSelectedQFRound(walletEligibleRounds[0] || EmptyRound);
				setIsSmartSelect(false);
			}
		} else {
			// Fallback to the first round eligible for the connected network
			const eligibleRound = walletEligibleRounds.find(round =>
				round.eligibleNetworks.includes(chainId),
			);
			if (eligibleRound) {
				setSelectedQFRound(eligibleRound);
			} else if (!chainId) {
				// Wallet not connected yet — default to the first
				// wallet-donatable round instead of asking the user to pick;
				// eligibility is re-evaluated on connect and
				// EligibilityBadges warns if the network is not eligible for
				// matching.
				setSelectedQFRound(walletEligibleRounds[0] || EmptyRound);
			} else {
				setSelectedQFRound(EmptyRound);
			}
			setIsSmartSelect(false);
		}

		// Run only once to set selected round from URL
		if (
			!didRunRef.current &&
			router.query.roundId &&
			chainId !== 0 &&
			selectableRounds.length > 1 &&
			!isFetchingSmartSelect
		) {
			const matchedRound = selectableRounds.find(
				round => round.id === router.query.roundId,
			);
			if (matchedRound?.eligibleNetworks.includes(chainId)) {
				setSelectedQFRound(matchedRound);
				setIsSmartSelect(false);
			}

			didRunRef.current = true;
		}
	}, [
		selectableRounds,
		walletEligibleRounds,
		smartSelectData,
		chainId,
		setSelectedQFRound,
		choosedModalRound,
		isQRDonation,
	]);

	// Nothing this flow has a route to donate to — no selector (e.g. the
	// cause flow when the only active round is Stellar-only)
	if (selectableRounds.length === 0) {
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
					QFRounds={selectableRounds}
					setShowModal={setShowQFRoundModal}
					project={project}
					selectedRound={selectedQFRound}
					onRoundSelect={handleRoundSelect}
					chainId={chainId}
					setChoosedModalRound={setChoosedModalRound}
					isQRDonation={isQRDonation}
					onStellarDonation={onStellarDonation}
					opensStellarFlow={opensStellarFlow}
					getSwitchableNetworks={getSwitchableNetworks}
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
