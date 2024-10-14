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
	B,
	Button,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import SocialBox from '../../DonateSocialBox';
import NiceBanner from './NiceBanner';
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
import QFSection from '../project/projectActionCard/QFSection';
import ProjectCardImage from '@/components/project-card/ProjectCardImage';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { DonatePageProjectDescription } from './DonatePageProjectDescription';
import QRDonationDetails from '@/components/views/donate/OneTime/SelectTokenModal/QRCodeDonation/QRDonationDetails';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { client } from '@/apollo/apolloClient';
import { FETCH_DONATION_BY_ID } from '@/apollo/gql/gqlDonations';
import { IDonation, IWalletAddress } from '@/apollo/types/types';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import { useQRCodeDonation } from '@/hooks/useQRCodeDonation';
import EndaomentProjectsInfo from '@/components/views/project/EndaomentProjectsInfo';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import StorageLabel from '@/lib/localStorage';
import DonationByProjectOwner from '@/components/modals/DonationByProjectOwner';
import { isWalletSanctioned } from '@/services/donation';
import SanctionModal from '@/components/modals/SanctionedModal';
import { PassportBanner } from '@/components/PassportBanner';
import QFEligibleNetworks from '@/components/views/donate/QFEligibleNetworks';
import { GIVBACKS_DONATION_QUALIFICATION_VALUE_USD } from '@/lib/constants/constants';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const {
		project,
		successDonation,
		qrDonationStatus,
		draftDonationData,
		hasActiveQFRound,
		shouldRenderModal,
		setSuccessDonation,
		setQRDonationStatus,
		setDraftDonationData,
		setPendingDonationExists,
		activeStartedRound,
		startTimer,
		setDonateModalByPriority,
		setIsModalPriorityChecked,
	} = useDonateData();
	const { renewExpirationDate, retrieveDraftDonation } =
		useQRCodeDonation(project);
	const { isSignedIn, isEnabled } = useAppSelector(state => state.user);

	const alreadyDonated = useAlreadyDonatedToProject(project);
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
			<DonateHeader />
			<DonateSuccessContainer>
				<SuccessView isStellar={isQRDonation} />
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
					{!isSafeEnv &&
						hasActiveQFRound &&
						!isOnSolana &&
						(!isQRDonation ||
							(isQRDonation && isStellarIncludedInQF)) && (
							<PassportBanner />
						)}
					<NiceBanner />
					<Row>
						<Col xs={12} lg={6}>
							<DonationCard
								setShowQRCode={setShowQRCode}
								showQRCode={showQRCode}
							/>
						</Col>
						<Col xs={12} lg={6}>
							<InfoWrapper
								style={{
									marginBottom: isFailedOperation ? 24 : 0,
								}}
							>
								{showQRCode ? (
									<QRDonationDetails />
								) : (
									<>
										<EndaomentProjectsInfo
											orgLabel={
												project?.organization?.label
											}
										/>
										{activeStartedRound && (
											<QFEligibleNetworks />
										)}
										<ImageWrapper>
											<ProjectCardImage
												image={project.image}
											/>
										</ImageWrapper>

										{!isMobile ? (
											isRecurringTab &&
											isOnEligibleNetworks ? (
												<QFSection
													projectData={project}
												/>
											) : (
												<DonatePageProjectDescription
													projectData={project}
												/>
											)
										) : null}
									</>
								)}
							</InfoWrapper>
							{isFailedOperation && (
								<QRRetryWrapper style={{ gap: 20 }}>
									<B>
										{formatMessage({
											id: 'label.need_a_new_qr_code',
										})}
									</B>
									<InlineToast
										type={EToastType.Warning}
										message={formatMessage({
											id: 'label.new_qr_code_needed',
										})}
									/>
									<ButtonStyled
										label={formatMessage({
											id: 'label.update_qr_code',
										})}
										onClick={updateQRCode}
									/>
								</QRRetryWrapper>
							)}
						</Col>
					</Row>
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
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 16px;
	text-align: left;
`;

const QRRetryWrapper = styled(Flex)`
	flex-direction: column;
	padding: 24px;
	border-radius: 16px;
	background-color: ${neutralColors.gray[100]};
	gap: 20px;
	text-align: left;
`;

const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 231px;
	margin-bottom: 24px;
	border-radius: 8px;
	overflow: hidden;
`;

const ButtonStyled = styled(Button)`
	width: 100%;
	text-transform: capitalize;
`;

export default DonateIndex;
