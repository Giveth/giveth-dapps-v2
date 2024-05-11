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
	IconArrowDownCircle16,
} from '@giveth/ui-design-system';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAccount, useSwitchChain } from 'wagmi';
import { useProjectContext } from '@/context/project.context';
import { VerificationModal } from '@/components/modals/VerificationModal';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { capitalizeAllWords } from '@/lib/helpers';
import { Dropdown, IOption, EOptionType } from '@/components/Dropdown';
import { idToProjectEdit } from '@/lib/routeCreators';
import ShareModal from '@/components/modals/ShareModal';
import { EContentType } from '@/lib/constants/shareContent';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { EVerificationStatus } from '@/apollo/types/types';
import ClaimRecurringDonationModal from '../../userProfile/projectsTab/ClaimRecurringDonationModal';
import config from '@/configuration';
import { findAnchorContractAddress } from '@/helpers/superfluid';

interface IMobileActionsModalProps {
	setShowModal: (value: boolean) => void;
	children: React.ReactNode;
}

export const AdminActions = () => {
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [deactivateModal, setDeactivateModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showMobileActionsModal, setShowMobileActionsModal] = useState(false);
	const [showClaimModal, setShowClaimModal] = useState(false);
	const { projectData, isActive, activateProject } = useProjectContext();
	const project = projectData!;

	const { slug, verified, verificationFormStatus } = project;
	const { formatMessage } = useIntl();
	const router = useRouter();
	const isMobile = !useMediaQuery(device.tablet);
	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();
	const chainId = chain?.id;

	const isVerificationDisabled =
		verified ||
		verificationFormStatus === EVerificationStatus.SUBMITTED ||
		verificationFormStatus === EVerificationStatus.REJECTED ||
		!isActive;

	const anchorContractAddress = findAnchorContractAddress(
		project.anchorContracts,
	);

	const options: IOption[] = [
		{
			label: formatMessage({
				id: 'label.edit_project',
			}),
			type: EOptionType.ITEM,
			icon: <IconEdit16 />,
			cb: () => router.push(idToProjectEdit(projectData?.id || '')),
		},
		{
			label: capitalizeAllWords(
				formatMessage({
					id: 'label.verify_your_project',
				}),
			),
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

	const recurringDonationOption: IOption = {
		label: formatMessage({
			id: 'label.claim_recurring_donation',
		}),
		icon: <IconArrowDownCircle16 />,
		cb: () => {
			if (chainId !== config.OPTIMISM_NETWORK_NUMBER) {
				switchChain({
					chainId: config.OPTIMISM_NETWORK_NUMBER,
				});
			} else {
				setShowClaimModal && setShowClaimModal(true);
			}
		},
	};

	anchorContractAddress && options.push(recurringDonationOption);

	const dropdownStyle = {
		padding: '10px 16px',
		background: neutralColors.gray[300],
		borderRadius: '8px',
	};

	return !isMobile ? (
		<Wrapper>
			<Dropdown
				style={dropdownStyle}
				label='Project Actions'
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
					projectId={projectData?.id}
				/>
			)}
			{showShareModal && (
				<ShareModal
					contentType={EContentType.thisProject}
					setShowModal={setShowShareModal}
					projectHref={slug}
				/>
			)}
			{showClaimModal && (
				<ClaimRecurringDonationModal
					setShowModal={setShowClaimModal}
					project={project}
				/>
			)}
		</Wrapper>
	) : (
		<MobileWrapper
			gap='4px'
			onClick={() => setShowMobileActionsModal(true)}
		>
			<div>Project Actions</div>
			<IconChevronDown24 />
			{showMobileActionsModal && (
				<MobileActionsModal setShowModal={setShowMobileActionsModal}>
					{options.map(option => (
						<MobileActionModalItem
							key={option.label}
							onClick={option.cb}
						>
							<Flex gap='8px'>
								<Flex $alignItems='center'>{option.icon}</Flex>
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
			{showClaimModal && (
				<ClaimRecurringDonationModal
					setShowModal={setShowClaimModal}
					project={project}
				/>
			)}
		</MobileWrapper>
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

const Wrapper = styled.div`
	order: 1;
	margin-bottom: 16px;
	${mediaQueries.tablet} {
		margin-bottom: 5px;
		order: unset;
	}
`;

const MobileWrapper = styled(FlexCenter)`
	padding: 10px 16px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
`;

const MobileActionModalItem = styled(Flex)`
	padding: 16px 24px;
	border-bottom: ${neutralColors.gray[400]} 1px solid;
`;
