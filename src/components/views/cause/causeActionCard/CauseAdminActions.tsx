import {
	IconArchiving,
	IconChevronDown24,
	IconEdit16,
	IconShare16,
	IconVerifiedBadge16,
	mediaQueries,
	neutralColors,
	Flex,
	FlexCenter,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { VerificationModal } from '@/components/modals/VerificationModal';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { capitalizeAllWords } from '@/lib/helpers';
import { Dropdown, IOption, EOptionType } from '@/components/Dropdown';
import { idToCauseEdit } from '@/lib/routeCreators';
import ShareModal from '@/components/modals/ShareModal';
import { EContentType } from '@/lib/constants/shareContent';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { EVerificationStatus } from '@/apollo/types/types';
import { ProjectCardNotification } from './ProjectCardNotification';
import { useCauseContext } from '@/context/cause.context';

interface IMobileActionsModalProps {
	setShowModal: (value: boolean) => void;
	children: React.ReactNode;
}

export const CauseAdminActions = () => {
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [deactivateModal, setDeactivateModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showMobileActionsModal, setShowMobileActionsModal] = useState(false);
	const { causeData, isActive, activateProject, fetchCauseBySlug } =
		useCauseContext();
	const cause = causeData!;

	const { slug, isGivbackEligible, verificationFormStatus } = cause;
	const { formatMessage } = useIntl();
	const router = useRouter();
	const isMobile = !useMediaQuery(device.tablet);

	const { isAdminEmailVerified } = useCauseContext();

	const isVerificationDisabled =
		isGivbackEligible ||
		verificationFormStatus === EVerificationStatus.SUBMITTED ||
		verificationFormStatus === EVerificationStatus.REJECTED ||
		!isActive;

	const options: IOption[] = [
		{
			label: formatMessage({
				id: 'label.cause.edit_cause',
			}),
			type: EOptionType.ITEM,
			icon: <IconEdit16 />,
			cb: () => router.push(idToCauseEdit(causeData?.id || '')),
		},
		{
			label: formatMessage({
				id: formatMessage({
					id:
						verificationFormStatus === EVerificationStatus.DRAFT
							? 'label.resume_your_project'
							: 'label.verify_your_project',
				}),
			}),

			type: EOptionType.ITEM,
			icon: <IconVerifiedBadge16 />,
			cb: () => setShowVerificationModal(true),
			isHidden: isVerificationDisabled,
		},
		{
			label: capitalizeAllWords(
				formatMessage({
					id: isActive
						? 'label.deactivate_project'
						: 'label.activate_project',
				}),
			),
			type: EOptionType.ITEM,
			icon: <IconArchiving size={16} />,
			cb: () => (isActive ? setDeactivateModal(true) : activateProject()),
		},
		{
			label: formatMessage({
				id: 'label.share',
			}),
			type: EOptionType.ITEM,
			icon: <IconShare16 />,
			cb: () => setShowShareModal(true),
			isHidden: !isActive,
		},
	];

	const dropdownStyle = {
		padding: '10px 16px',
		background: neutralColors.gray[300],
		borderRadius: '8px',
	};

	return !isMobile ? (
		<>
			{!isAdminEmailVerified && (
				<VerifyNotification>
					{formatMessage({
						id: 'label.email_actions_text',
					})}
				</VerifyNotification>
			)}
			<Wrapper $verified={isAdminEmailVerified}>
				<Dropdown
					style={dropdownStyle}
					label={formatMessage({
						id: 'label.cause.cause_actions',
					})}
					options={options}
				/>
				{showVerificationModal && (
					<VerificationModal
						onClose={() => setShowVerificationModal(false)}
					/>
				)}
				{deactivateModal && (
					<DeactivateProjectModal
						setShowModal={setDeactivateModal}
						projectId={causeData?.id}
						onSuccess={fetchCauseBySlug}
					/>
				)}
				{showShareModal && (
					<ShareModal
						contentType={EContentType.thisProject}
						setShowModal={setShowShareModal}
						projectHref={slug}
					/>
				)}
				<ProjectCardNotification />
			</Wrapper>
		</>
	) : (
		<>
			{!isAdminEmailVerified && (
				<VerifyNotification>
					{formatMessage({
						id: 'label.email_actions_text',
					})}
				</VerifyNotification>
			)}
			<MobileWrapper
				gap='4px'
				onClick={() => setShowMobileActionsModal(true)}
				$verified={isAdminEmailVerified}
			>
				<div>Project Actions</div>
				<IconChevronDown24 />
				{showMobileActionsModal && (
					<MobileActionsModal
						setShowModal={setShowMobileActionsModal}
					>
						{options.map(option => (
							<MobileActionModalItem
								key={option.label}
								onClick={option.cb}
							>
								<Flex gap='8px'>
									<Flex $alignItems='center'>
										{option.icon}
									</Flex>
									<div>{option.label}</div>
								</Flex>
							</MobileActionModalItem>
						))}
						{showVerificationModal && (
							<VerificationModal
								onClose={() => setShowVerificationModal(false)}
							/>
						)}
						{deactivateModal && (
							<DeactivateProjectModal
								setShowModal={setDeactivateModal}
								projectId={projectData?.id}
								onSuccess={fetchProjectBySlug}
							/>
						)}
						{showShareModal && (
							<ShareModal
								contentType={EContentType.thisProject}
								setShowModal={setShowShareModal}
								projectHref={slug}
							/>
						)}
					</MobileActionsModal>
				)}
			</MobileWrapper>
			<ProjectCardNotification />
		</>
	);
};

const MobileActionsModal: FC<IMobileActionsModalProps> = ({
	setShowModal,
	children,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			{children}
		</Modal>
	);
};

interface WrapperProps {
	$verified: boolean;
}

const Wrapper = styled.div<WrapperProps>`
	order: 1;
	margin-bottom: 16px;
	opacity: ${({ $verified }) => ($verified ? 1 : 0.5)};
	pointer-events: ${({ $verified }) => ($verified ? 'auto' : 'none')};
	${mediaQueries.tablet} {
		margin-bottom: 5px;
		order: unset;
	}
`;

const MobileWrapper = styled(FlexCenter)<WrapperProps>`
	padding: 10px 16px;
	background-color: ${neutralColors.gray[300]};
	opacity: ${({ $verified }) => ($verified ? 1 : 0.5)};
	pointer-events: ${({ $verified }) => ($verified ? 'auto' : 'none')};
	border-radius: 8px;
`;

const MobileActionModalItem = styled(Flex)`
	padding: 16px 24px;
	border-bottom: ${neutralColors.gray[400]} 1px solid;
`;

const VerifyNotification = styled.div`
	font-size: 14px;
	text-align: center;
	color: ${semanticColors.golden[600]};
`;
