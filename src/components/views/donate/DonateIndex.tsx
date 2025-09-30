import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	Col,
	Container,
	IconDonation24,
	neutralColors,
	Row,
	semanticColors,
	SublineBold,
	Flex,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import SocialBox from '../../DonateSocialBox';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import {
	DonateModalPriorityValues,
	useDonateData,
} from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowHeader } from '@/features/general/general.slice';
import { DonateHeader } from './DonateHeader';
import { DonationCard, ETabs } from './DonationCard';
import { SuccessView } from './SuccessView';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { client } from '@/apollo/apolloClient';
import { FETCH_DONATION_BY_ID } from '@/apollo/gql/gqlDonations';
import { IDonation, IWalletAddress } from '@/apollo/types/types';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import { useQRCodeDonation } from '@/hooks/useQRCodeDonation';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import StorageLabel from '@/lib/localStorage';
import DonationByProjectOwner from '@/components/modals/DonationByProjectOwner';
import { isWalletSanctioned } from '@/services/donation';
import SanctionModal from '@/components/modals/SanctionedModal';
import { GIVBACKS_DONATION_QUALIFICATION_VALUE_USD } from '@/lib/constants/constants';
import QRDonationDetails from './OneTime/SelectTokenModal/QRCodeDonation/QRDonationDetails';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const {
		project,
		successDonation,
		qrDonationStatus,
		draftDonationData,
		shouldRenderModal,
		setSuccessDonation,
		setQRDonationStatus,
		setDraftDonationData,
		setPendingDonationExists,
		activeStartedRound,
		selectedQFRound,
		startTimer,
		setDonateModalByPriority,
		setIsModalPriorityChecked,
	} = useDonateData();
	const { renewExpirationDate, retrieveDraftDonation } =
		useQRCodeDonation(project);
	const { isSignedIn, isEnabled } = useAppSelector(state => state.user);

	const alreadyDonated = useAlreadyDonatedToProject(project, selectedQFRound);
	const { userData } = useAppSelector(state => state.user);

	const dispatch = useAppDispatch();
	const isSafeEnv = useIsSafeEnvironment();
	const { isOnSolana } = useGeneralWallet();
	const router = useRouter();
	const { chainId } = useAccount();
	const [showQRCode, setShowQRCode] = React.useState(
		!!router.query.draft_donation,
	);
	const { walletAddress: address } = useGeneralWallet();
	const [stopTimer, setStopTimer] = React.useState<void | (() => void)>();

	const isQRDonation = router.query.chain === ChainType.STELLAR.toLowerCase();
	const isStellarIncludedInQF =
		activeStartedRound?.eligibleNetworks?.includes(
			config.STELLAR_NETWORK_NUMBER,
		);

	const isStellarOnlyQF =
		isQRDonation &&
		activeStartedRound?.eligibleNetworks?.length === 1 &&
		isStellarIncludedInQF;

	useEffect(() => {
		dispatch(setShowHeader(false));
		return () => {
			dispatch(setShowHeader(true));
		};
	}, [dispatch]);

	const validateSanctions = async () => {
		if (project.organization?.label === 'endaoment' && address) {
			// We just need to check if the wallet is sanctioned for endaoment projects
			const sanctioned = await isWalletSanctioned(address);
			if (sanctioned) {
				setDonateModalByPriority(
					DonateModalPriorityValues.OFACSanctionListModal,
				);
				return;
			}
		}
		setIsModalPriorityChecked(
			DonateModalPriorityValues.OFACSanctionListModal,
		);
	};

	useEffect(() => {
		validateSanctions();
	}, [project, address]);

	useEffect(() => {
		if (
			userData?.id !== undefined &&
			userData?.id === project.adminUser.id
		) {
			setDonateModalByPriority(
				DonateModalPriorityValues.DonationByProjectOwner,
			);
		}
		setIsModalPriorityChecked(
			DonateModalPriorityValues.DonationByProjectOwner,
		);
	}, [userData?.id, project.adminUser]);

	useEffect(() => {
		const fetchDonation = async () => {
			if (qrDonationStatus === 'success') {
				const {
					data: { getDonationById },
				} = (await client.query({
					query: FETCH_DONATION_BY_ID,
					variables: {
						id: Number(draftDonationData?.matchedDonationId),
					},
					fetchPolicy: 'no-cache',
				})) as { data: { getDonationById: IDonation } };

				if (!getDonationById) return;

				const { transactionId, isTokenEligibleForGivback } =
					getDonationById;

				if (!transactionId) return;
				const includeInQF =
					activeStartedRound && !!getDonationById.valueUsd;
				setSuccessDonation({
					txHash: [
						{
							txHash: transactionId,
							chainType: ChainType.STELLAR,
						},
					],
					excludeFromQF: !includeInQF,
					givBackEligible:
						isTokenEligibleForGivback &&
						project.verified &&
						isSignedIn &&
						isEnabled &&
						getDonationById.amount >=
							GIVBACKS_DONATION_QUALIFICATION_VALUE_USD,
					chainId: config.STELLAR_NETWORK_NUMBER,
				});
			}
		};
		fetchDonation();
	}, [qrDonationStatus]);

	const isRecurringTab = router.query.tab?.toString() === ETabs.RECURRING;
	const isOnEligibleNetworks =
		chainId && activeStartedRound?.eligibleNetworks?.includes(chainId);
	const isFailedOperation = ['expired', 'failed'].includes(qrDonationStatus);
	const showAlreadyDonatedWrapper =
		alreadyDonated &&
		(isQRDonation ? isStellarIncludedInQF : isOnEligibleNetworks);

	const updateQRCode = async () => {
		if (!draftDonationData?.id) return;

		const draftDonations = localStorage.getItem(
			StorageLabel.DRAFT_DONATIONS,
		);

		const parsedLocalStorageItem = JSON.parse(draftDonations!);

		const projectAddress: IWalletAddress | undefined =
			project.addresses?.find(
				address => address.chainType === ChainType.STELLAR,
			);
		let draftDonationId = parsedLocalStorageItem
			? parsedLocalStorageItem[projectAddress?.address!]
			: null;

		const retDraftDonation = !!draftDonationId
			? await retrieveDraftDonation(Number(draftDonationId))
			: null;

		if (retDraftDonation && retDraftDonation.status === 'pending') {
			setPendingDonationExists?.(true);
			parsedLocalStorageItem[projectAddress?.address!] =
				retDraftDonation.id;
			localStorage.setItem(
				StorageLabel.DRAFT_DONATIONS,
				JSON.stringify(parsedLocalStorageItem),
			);
			router.push(
				{
					query: {
						...router.query,
						draft_donation: retDraftDonation.id,
					},
				},
				undefined,
				{ shallow: true },
			);
		} else {
			const expiresAt = await renewExpirationDate(draftDonationData?.id);
			setDraftDonationData((prev: IDraftDonation | null) => {
				if (!prev) return null;
				return {
					...prev,
					status: 'pending',
					expiresAt: expiresAt?.toString() ?? undefined,
				};
			});
			parsedLocalStorageItem[projectAddress?.address!] =
				draftDonationData.id;
			localStorage.setItem(
				StorageLabel.DRAFT_DONATIONS,
				JSON.stringify(parsedLocalStorageItem),
			);
			setQRDonationStatus('waiting');
			const stopTimerFun = startTimer?.(new Date(expiresAt!));
			setStopTimer(() => stopTimerFun);
		}
	};

	useEffect(() => {
		if (!showQRCode) stopTimer?.();
		else setStopTimer(() => undefined);
	}, [showQRCode]);

	useEffect(() => {
		if (qrDonationStatus === 'failed') {
			stopTimer?.();
		}
	}, [qrDonationStatus]);

	return successDonation ? (
		<>
			<DonateHeader
				isSuccessDonation={Object.keys(successDonation).length > 0}
			/>
			<DonateSuccessContainer>
				<SuccessView
					isStellar={isQRDonation}
					isStellarInQF={isStellarIncludedInQF}
				/>
			</DonateSuccessContainer>
		</>
	) : (
		<>
			<DonateHeader />
			<Wrapper>
				<DonateContainer>
					{shouldRenderModal(
						DonateModalPriorityValues.DonationByProjectOwner,
					) && (
						<DonationByProjectOwner
							closeModal={() => {
								setDonateModalByPriority(
									DonateModalPriorityValues.None,
								);
							}}
						/>
					)}

					{shouldRenderModal(
						DonateModalPriorityValues.OFACSanctionListModal,
					) && (
						<SanctionModal
							closeModal={() => {
								setDonateModalByPriority(
									DonateModalPriorityValues.None,
								);
							}}
						/>
					)}

					{showAlreadyDonatedWrapper && (
						<AlreadyDonatedWrapper>
							<IconDonation24 />
							<SublineBold>
								{formatMessage({
									id: 'component.already_donated.incorrect_estimate',
								})}
							</SublineBold>
						</AlreadyDonatedWrapper>
					)}
					<DonateRow>
						<Col xs={12} lg={6}>
							<DonationCard
								setShowQRCode={setShowQRCode}
								showQRCode={showQRCode}
							/>
							{showQRCode && (
								<InfoWrapper
									style={{
										marginBottom: isFailedOperation
											? 24
											: 0,
									}}
								>
									<QRDonationDetails />
								</InfoWrapper>
							)}
						</Col>
					</DonateRow>
					{!isMobile && (
						<SocialBox
							contentType={EContentType.thisProject}
							project={project}
							isDonateFooter
						/>
					)}
				</DonateContainer>
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	margin-top: 91px;
`;

const DonateRow = styled(Row)`
	justify-content: center;
`;

const AlreadyDonatedWrapper = styled(Flex)`
	margin-bottom: 16px;
	padding: 12px 16px;
	gap: 8px;
	color: ${semanticColors.jade[500]};
	box-shadow: ${Shadow.Neutral[400]};
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
	align-items: center;
`;

const DonateSuccessContainer = styled(Container)`
	text-align: center;
	padding-top: 110px;
	padding-bottom: 64px;
	position: relative;
`;

const DonateContainer = styled(Container)`
	text-align: center;
	padding-top: 10px;
	padding-bottom: 64px;
	position: relative;
`;

const InfoWrapper = styled.div`
	margin-top: 36px;
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 16px;
	text-align: left;
`;

export default DonateIndex;
