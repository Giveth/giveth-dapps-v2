import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	IconChevronRight,
	IconDeactivated24,
	IconDiscord18,
	IconPublish24,
	IconRocketInSpace16,
	IconSunrise16,
	IconVerifiedBadge16,
	mediaQueries,
	neutralColors,
	OutlineButton,
	P,
	semanticColors,
	Flex,
	IconGIVBack24,
	IconExternalLink,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { useProjectContext } from '@/context/project.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import { isSSRMode } from '@/lib/helpers';
import BoostModal from '@/components/modals/Boost/BoostModal';
import { useAppSelector } from '@/features/hooks';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { EVerificationStatus } from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';
import { VerificationModal } from '@/components/modals/VerificationModal';
import { GIVBACKS_DONATION_QUALIFICATION_VALUE_USD } from '@/lib/constants/constants';

const ProjectGIVbackToast = () => {
	const [showBoost, setShowBoost] = useState(false);
	const [showVerification, setShowVerification] = useState(false);
	const { projectData, isAdmin, activateProject } = useProjectContext();
	const verStatus = projectData?.verificationFormStatus;
	const projectStatus = projectData?.status.name;
	const isGivbackEligible = projectData?.isGivbackEligible;
	const isVerified = projectData?.verified;
	const { givbackFactor } = projectData || {};
	const isOwnerGivbackEligible = isGivbackEligible && isAdmin;
	const isOwnerNotVerified = !isGivbackEligible && isAdmin;
	const isPublicGivbackEligible = isGivbackEligible && !isAdmin;
	const isPublicVerifiedNotEligible =
		isVerified && !isAdmin && !isGivbackEligible;
	const isOwnerVerifiedNotEligible =
		isVerified && isAdmin && !isGivbackEligible;

	let color = isOwnerGivbackEligible
		? semanticColors.golden[600]
		: neutralColors.gray[900];
	const { formatMessage } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();
	const {
		isEnabled,
		isSignedIn,
		isLoading: isUserLoading,
	} = useAppSelector(state => state.user);
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

	const showBoostModal = () => {
		setShowBoost(true);
	};

	const { modalCallback: signInThenBoost } = useModalCallback(showBoostModal);

	const handleBoostClick = () => {
		if (isSSRMode) return;
		if (!isEnabled) {
			openConnectModal?.();
		} else if (!isSignedIn) {
			signInThenBoost();
		} else {
			showBoostModal();
		}
	};

	const useIntlTitle = 'project.givback_toast.title.';
	const useIntlDescription = 'project.givback_toast.description.';
	let icon = <IconGIVBack24 color={color} />;
	let link = links.GIVBACK_DOC;

	let title = '';
	let description, Button;

	const givbackFactorPercent = ((givbackFactor || 0) * 100).toFixed();

	if (isPublicGivbackEligible) {
		if (givbackFactor !== 0) {
			title = formatMessage(
				{
					id: `${useIntlTitle}verified_public_3`,
				},
				{
					percent: givbackFactorPercent,
					// value: GIVBACKS_DONATION_QUALIFICATION_VALUE_USD,
				},
			);
		}
		description = formatMessage(
			{
				id: `${useIntlDescription}verified_public`,
			},
			{
				value: GIVBACKS_DONATION_QUALIFICATION_VALUE_USD,
			},
		);
		link = links.GIVPOWER_DOC;
		Button = (
			<OutlineButton
				onClick={handleBoostClick}
				label='Boost'
				icon={<IconRocketInSpace16 />}
			/>
		);
	} else if (isOwnerGivbackEligible) {
		if (givbackFactor !== 0) {
			title = formatMessage(
				{
					id: `${useIntlTitle}verified_owner`,
				},
				{
					percent: givbackFactorPercent,
					value: GIVBACKS_DONATION_QUALIFICATION_VALUE_USD,
				},
			);
		}
		description = formatMessage({
			id: `${useIntlDescription}verified_owner`,
		});
		link = links.GIVPOWER_DOC;
		Button = (
			<OutlineButton
				onClick={handleBoostClick}
				label='Boost'
				icon={<IconRocketInSpace16 />}
			/>
		);
	} else if (isOwnerNotVerified) {
		if (verStatus === EVerificationStatus.SUBMITTED) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_submitted`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_submitted`,
			});
			link = links.VERIFICATION_DOCS;
		} else if (verStatus === EVerificationStatus.REJECTED) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_rejected`,
			});
			description = (
				<>
					{formatMessage({
						id: `${useIntlDescription}non_verified_owner_rejected_1`,
					})}
					<span> info@giveth.io </span>
					{formatMessage({
						id: `${useIntlDescription}non_verified_owner_rejected_2`,
					})}
				</>
			);
			link = links.VERIFICATION_DOCS;
			Button = (
				<ExternalLink href={links.DISCORD}>
					<OutlineButton
						label='Join Discord'
						icon={<IconDiscord18 />}
					/>
				</ExternalLink>
			);
		} else if (verStatus === EVerificationStatus.DRAFT) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_incomplete`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_incomplete`,
			});
			link = links.VERIFICATION_DOCS;
			Button = (
				<ExternalLink href={`${Routes.Verification}/${slug}`}>
					<OutlineButton
						label='Resume GIVbacks Form'
						icon={<IconVerifiedBadge16 />}
					/>
				</ExternalLink>
			);
		} else if (projectStatus === EProjectStatus.DRAFT) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_draft`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_draft`,
			});
			icon = <IconPublish24 />;
			link = Routes.OnboardingProjects;
		} else if (projectStatus === EProjectStatus.DEACTIVE) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_deactive`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_deactive`,
			});
			icon = <IconDeactivated24 />;
			link = '';
			Button = (
				<OutlineButton
					onClick={activateProject}
					label='Reactivate Project'
					icon={<IconSunrise16 />}
				/>
			);
		} else if (projectStatus === EProjectStatus.CANCEL) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_cancelled`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_cancelled`,
			});
			icon = <IconDeactivated24 />;
			link = links.CANCELLED_PROJECTS_DOCS;
		} else if (isOwnerVerifiedNotEligible) {
			title = formatMessage(
				{
					id: `${useIntlTitle}verified_owner`,
				},
				{
					percent: givbackFactorPercent,
					value: GIVBACKS_DONATION_QUALIFICATION_VALUE_USD,
				},
			);
			description = formatMessage({
				id: `${useIntlDescription}verified_owner_not_eligible`,
			});
			color = semanticColors.golden[600];
			icon = <IconGIVBack24 color={semanticColors.golden[600]} />;
			link = links.GIVPOWER_DOC;
			Button = (
				<OutlineButton
					onClick={handleBoostClick}
					label='Boost'
					icon={<IconRocketInSpace16 />}
				/>
			);
		} else {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner`,
			});
			link = links.VERIFICATION_DOCS;
			Button = (
				<OutlineButton
					onClick={() => setShowVerification(true)}
					label={formatMessage({ id: 'label.project_verify' })}
					icon={<IconVerifiedBadge16 />}
				/>
			);
		}
	} else if (isPublicVerifiedNotEligible) {
		title = formatMessage({
			id: `${useIntlTitle}verified_public_not_eligible`,
		});
		description = formatMessage(
			{
				id: `${useIntlDescription}verified_public_not_eligible`,
			},
			{
				stakeLock: (
					<InnerLink href={Routes.GIVfarm} target='_blank'>
						{formatMessage({ id: 'label.stake_and_lock' })}{' '}
					</InnerLink>
				),
			},
		);
		link = links.GIVPOWER_DOC;
		Button = (
			<OutlineButton
				onClick={handleBoostClick}
				label='Boost'
				icon={<IconRocketInSpace16 />}
			/>
		);
	} else if (isOwnerVerifiedNotEligible) {
		title = formatMessage({
			id: `${useIntlTitle}verified_owner_not_eligible`,
		});
		description = formatMessage(
			{
				id: `${useIntlDescription}verified_owner_not_eligible`,
			},
			{
				stakeLock: (
					<InnerLink href={Routes.GIVfarm} target='_blank'>
						{formatMessage({ id: 'label.stake_and_lock' })}{' '}
					</InnerLink>
				),
			},
		);
		link = links.GIVPOWER_DOC;
		Button = (
			<OutlineButton
				onClick={handleBoostClick}
				label='Boost'
				icon={<IconRocketInSpace16 />}
			/>
		);
	} else {
		title = formatMessage({
			id: `${useIntlTitle}non_verified_public`,
		});
		description = formatMessage({
			id: `${useIntlDescription}non_verified_public`,
		});
		link = links.VERIFICATION_DOCS;
		Button = (
			<ExternalLink
				href={`${links.DEVOUCH}/project/giveth/${projectData?.id}`}
			>
				<OutlineButton
					label={formatMessage({
						id: 'label.devouch.go_to_devouch',
					})}
					icon={
						<IconExternalLink
							size={16}
							color={brandColors.giv[500]}
						/>
					}
				/>
			</ExternalLink>
		);
	}

	useEffect(() => {
		if (isUserLoading) return;
		const { open } = router.query;
		const _open = Array.isArray(open) ? open[0] : open;
		if (_open === 'boost') {
			handleBoostClick();
		}
	}, [isUserLoading, router]);

	return (
		<>
			<Wrapper>
				<Content>
					{icon}
					<div>
						<Title color={color}>{title}</Title>
						<Description>{description}</Description>
						{link && (
							<ExternalLink
								color={brandColors.pinky[500]}
								href={link}
							>
								<LearnMore>
									{formatMessage({ id: 'label.learn_more' })}
									<IconChevronRight size={24} />
								</LearnMore>
							</ExternalLink>
						)}
					</div>
				</Content>
				{Button && <ButtonWrapper>{Button}</ButtonWrapper>}
			</Wrapper>
			{showBoost && (
				<BoostModal
					projectId={projectData?.id!}
					setShowModal={setShowBoost}
				/>
			)}
			{showVerification && (
				<VerificationModal onClose={() => setShowVerification(false)} />
			)}
		</>
	);
};

const LearnMore = styled(Caption)`
	display: flex;
	gap: 2px;
	color: ${brandColors.pinky[500]} !important;
`;

const Description = styled(P)`
	margin: 4px 0;
	color: ${neutralColors.gray[900]};
	> span {
		color: ${brandColors.pinky[500]};
	}
`;

const Title = styled(B)<{ color: string }>`
	color: ${({ color }) => color};
`;

const ButtonWrapper = styled.div`
	button {
		border-color: ${brandColors.giv[500]};
		flex-direction: row-reverse;
		color: ${brandColors.giv[500]};
		gap: 0;
		min-width: 180px;
		svg {
			margin-right: 8px;
			flex-shrink: 0;
		}
		span {
			text-transform: capitalize;
		}
	}
`;

const Content = styled(Flex)`
	gap: 16px;
	> :first-child {
		flex-shrink: 0;
	}
`;

const Wrapper = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	gap: 24px;
	padding: 24px 16px;
	background: #ffffff;
	border-radius: 16px;
	margin-top: 12px;
	flex-direction: column;
	${mediaQueries.laptopL} {
		flex-direction: row;
	}
`;

const InnerLink = styled.a`
	cursor: pointer;
	color: ${brandColors.pinky[500]};
`;

export default ProjectGIVbackToast;
