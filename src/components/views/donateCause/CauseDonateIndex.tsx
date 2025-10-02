import React, { FC, useCallback, useEffect } from 'react';
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
import { useAccount } from 'wagmi';
import SocialBox from '../../DonateSocialBox';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { EContentType } from '@/lib/constants/shareContent';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowHeader } from '@/features/general/general.slice';
import { CauseDonateHeader } from '@/components/views/donateCause/CauseDonateHeader';
import { CauseSuccessView } from '@/components/views/donateCause/CauseSuccessView';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import DonationByProjectOwner from '@/components/modals/DonationByProjectOwner';
import SanctionModal from '@/components/modals/SanctionedModal';
import { CauseDonationCard } from './CauseDonationCard';
import {
	useCauseDonateData,
	DonateModalPriorityValues,
} from '@/context/donate.cause.context';

const CauseDonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const {
		project,
		successDonation,
		selectedQFRound,
		shouldRenderModal,
		activeStartedRound,
		setDonateModalByPriority,
		setIsModalPriorityChecked,
	} = useCauseDonateData();

	const alreadyDonated = useAlreadyDonatedToProject(project, selectedQFRound);
	const { userData } = useAppSelector(state => state.user);

	const dispatch = useAppDispatch();
	const isSafeEnv = useIsSafeEnvironment();
	const { isOnSolana } = useGeneralWallet();
	const { chainId } = useAccount();

	const { walletAddress: address } = useGeneralWallet();
	const projectType = project.projectType;
	useEffect(() => {
		dispatch(setShowHeader(false));
		return () => {
			dispatch(setShowHeader(true));
		};
	}, [dispatch]);

	const validateSanctions = useCallback(async () => {
		setIsModalPriorityChecked(
			DonateModalPriorityValues.OFACSanctionListModal,
		);
	}, [setIsModalPriorityChecked]);

	useEffect(() => {
		validateSanctions();
	}, [project, address, validateSanctions]);

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
	}, [
		userData?.id,
		project.adminUser,
		setIsModalPriorityChecked,
		setDonateModalByPriority,
	]);

	const isOnEligibleNetworks =
		chainId && activeStartedRound?.eligibleNetworks?.includes(chainId);
	const showAlreadyDonatedWrapper = alreadyDonated && isOnEligibleNetworks;
	const causeProjectsCount = project.activeProjectsCount || 0;
	console.log('project', project);
	return successDonation ? (
		<>
			<CauseDonateHeader
				isSuccessDonation={Object.keys(successDonation).length > 0}
			/>
			<DonateSuccessContainer>
				<CauseSuccessView isStellar={false} isStellarInQF={false} />
			</DonateSuccessContainer>
		</>
	) : (
		<>
			<CauseDonateHeader />
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
							projectType={projectType}
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
							<CauseDonationCard chainId={chainId || 0} />
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
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 16px;
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

export default CauseDonateIndex;
