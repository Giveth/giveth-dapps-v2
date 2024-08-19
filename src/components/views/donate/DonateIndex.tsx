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
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { PassportBanner } from '@/components/PassportBanner';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';
import { useAppDispatch } from '@/features/hooks';
import { setShowHeader } from '@/features/general/general.slice';
import { DonateHeader } from './DonateHeader';
import { DonationCard, ETabs } from './DonationCard';
import { SuccessView } from './SuccessView';
import QFSection from '../project/projectActionCard/QFSection';
import ProjectCardImage from '@/components/project-card/ProjectCardImage';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { DonatePageProjectDescription } from './DonatePageProjectDescription';
import { getActiveRound } from '@/helpers/qf';
import QRDonationDetails from './OnTime/SelectTokenModal/QRCodeDonation/QRDonationDetails';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_DONATION_BY_ID,
	FETCH_DRAFT_DONATION,
} from '@/apollo/gql/gqlDonations';
import { IDonation } from '@/apollo/types/types';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import { useQRCodeDonation } from '@/hooks/useQRCodeDonation';
import EndaomentProjectsInfo from '@/components/views/project/EndaomentProjectsInfo';
import Routes from '@/lib/constants/Routes';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import StorageLabel from '@/lib/localStorage';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const {
		project,
		successDonation,
		qrDonationStatus,
		draftDonationData,
		hasActiveQFRound,
		setSuccessDonation,
		setQRDonationStatus,
		startTimer,
	} = useDonateData();
	const { renewExpirationDate } = useQRCodeDonation();

	const alreadyDonated = useAlreadyDonatedToProject(project);
	const dispatch = useAppDispatch();
	const isSafeEnv = useIsSafeEnvironment();
	const { isOnSolana } = useGeneralWallet();
	const router = useRouter();
	const { chainId } = useAccount();

	const [showQRCode, setShowQRCode] = React.useState(false);
	const [stopTimer, setStopTimer] = React.useState<void | (() => void)>();

	useEffect(() => {
		dispatch(setShowHeader(false));
		return () => {
			dispatch(setShowHeader(true));
		};
	}, [dispatch]);

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

				setSuccessDonation({
					txHash: [
						{
							txHash: transactionId,
							chainType: ChainType.STELLAR,
						},
					],
					givBackEligible: isTokenEligibleForGivback,
					chainId: config.STELLAR_NETWORK_NUMBER,
				});
			}
		};
		fetchDonation();
	}, [qrDonationStatus]);

	useEffect(() => {
		const fetchDraftDonationData = async () => {
			const draftDonations = localStorage.getItem(
				StorageLabel.DRAFT_DONATIONS,
			);

			if (!draftDonations) return;

			const parsedLocalStorageItem = JSON.parse(draftDonations);

			const stellarAddress = project.addresses?.find(
				address => address.chainType === ChainType.STELLAR,
			)?.address;

			const draftDonationId = parsedLocalStorageItem[stellarAddress!];

			if (!draftDonationId) return;

			const {
				data: { getDraftDonationById },
			} = (await client.query({
				query: FETCH_DRAFT_DONATION,
				variables: { id: Number(draftDonationId) },
				fetchPolicy: 'no-cache',
			})) as { data: { getDraftDonationById: IDraftDonation } };

			if (getDraftDonationById?.status === 'pending') {
				window.open(
					Routes.Invoice + '/' + getDraftDonationById?.id,
					'_self',
				);
			}
		};

		fetchDraftDonationData();
	}, []);

	const isRecurringTab = router.query.tab?.toString() === ETabs.RECURRING;
	const { activeStartedRound } = getActiveRound(project.qfRounds);
	const isOnEligibleNetworks =
		chainId && activeStartedRound?.eligibleNetworks?.includes(chainId);
	const isFailedOperation = ['expired', 'failed'].includes(qrDonationStatus);

	const updateQRCode = async () => {
		if (!draftDonationData?.id) return;

		setQRDonationStatus('waiting');
		const expiresAt = await renewExpirationDate(draftDonationData?.id);
		const stopTimerFun = startTimer?.(new Date(expiresAt!));
		setStopTimer(() => stopTimerFun);
	};

	useEffect(() => {
		if (!showQRCode) stopTimer?.();
		else setStopTimer(() => undefined);
	}, [showQRCode]);

	return successDonation ? (
		<>
			<DonateHeader />
			<DonateContainer>
				<SuccessView />
			</DonateContainer>
		</>
	) : (
		<>
			<DonateHeader />
			<DonateContainer>
				{alreadyDonated && (
					<AlreadyDonatedWrapper>
						<IconDonation24 />
						<SublineBold>
							{formatMessage({
								id: 'component.already_donated.incorrect_estimate',
							})}
						</SublineBold>
					</AlreadyDonatedWrapper>
				)}
				{!isSafeEnv && hasActiveQFRound && !isOnSolana && (
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
							style={{ marginBottom: isFailedOperation ? 24 : 0 }}
						>
							{showQRCode ? (
								<QRDonationDetails />
							) : (
								<>
									<EndaomentProjectsInfo
										orgLabel={project?.organization?.label}
									/>
									<ImageWrapper>
										<ProjectCardImage
											image={project.image}
										/>
									</ImageWrapper>
									{!isMobile ? (
										(!isRecurringTab && hasActiveQFRound) ||
										(isRecurringTab &&
											isOnEligibleNetworks) ? (
											<QFSection projectData={project} />
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
		</>
	);
};

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

const DonateContainer = styled(Container)`
	text-align: center;
	padding-top: 110px;
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
