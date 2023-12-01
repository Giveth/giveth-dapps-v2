import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	IconChevronRight,
	IconDeactivated24,
	IconGIVBack,
	IconPublish24,
	IconRocketInSpace16,
	mediaQueries,
	neutralColors,
	OutlineButton,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Flex } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { useProjectContext } from '@/context/project.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import { isSSRMode } from '@/lib/helpers';
import BoostModal from '@/components/modals/Boost/BoostModal';
import { useAppSelector } from '@/features/hooks';
import { formatDonation } from '@/helpers/number';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { EVerificationStatus } from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';

const ProjectGIVbackToast = () => {
	const [showBoost, setShowBoost] = useState(false);
	const { projectData, isAdmin } = useProjectContext();
	const verStatus = projectData?.verificationFormStatus;
	const projectStatus = projectData?.status.name;
	const verified = projectData?.verified;
	const { givbackFactor } = projectData || {};
	const isOwnerVerified = verified && isAdmin;
	const isOwnerNotVerified = !verified && isAdmin;
	const isPublicVerified = verified && !isAdmin;
	const color = isOwnerVerified
		? semanticColors.golden[600]
		: neutralColors.gray[900];
	const { formatMessage, locale } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();
	const {
		isEnabled,
		isSignedIn,
		isLoading: isUserLoading,
	} = useAppSelector(state => state.user);
	const router = useRouter();

	const useIntlTitle = 'project.givback_toast.title.';
	const useIntlDescription = 'project.givback_toast.description.';
	let icon = <IconGIVBack color={color} size={24} />;
	let link = links.GIVBACK_DOC;

	let title,
		description = '';

	if (isOwnerVerified) {
		if (givbackFactor !== 0) {
			title =
				formatMessage({
					id: `${useIntlTitle}verified_owner_1`,
				}) +
				formatDonation(
					(givbackFactor || 0) * 100,
					undefined,
					locale,
					true,
				) +
				'%' +
				formatMessage({
					id: `${useIntlTitle}verified_owner_2`,
				});
		}
		description = formatMessage({
			id: `${useIntlDescription}verified_owner`,
		});
		link = links.GIVPOWER_DOC;
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
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_rejected`,
			});
			link = links.VERIFICATION_DOCS;
		} else if (verStatus === EVerificationStatus.DRAFT) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_incomplete`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_incomplete`,
			});
			link = links.VERIFICATION_DOCS;
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
		} else if (projectStatus === EProjectStatus.CANCEL) {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner_cancelled`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner_cancelled`,
			});
			icon = <IconDeactivated24 />;
			link = links.CANCELLED_PROJECTS_DOCS;
		} else {
			title = formatMessage({
				id: `${useIntlTitle}non_verified_owner`,
			});
			description = formatMessage({
				id: `${useIntlDescription}non_verified_owner`,
			});
			link = links.VERIFICATION_DOCS;
		}
	} else if (isPublicVerified) {
		if (givbackFactor !== 0) {
			title =
				formatMessage({
					id: `${useIntlTitle}verified_public_1`,
				}) +
				Math.round(+(givbackFactor || 0) * 100) +
				'%' +
				formatMessage({
					id: `${useIntlTitle}verified_public_2`,
				});
		}
		description = formatMessage({
			id: `${useIntlDescription}verified_public`,
		});
	} else {
		title = formatMessage({
			id: `${useIntlTitle}non_verified_public`,
		});
		description = formatMessage({
			id: `${useIntlDescription}non_verified_public`,
		});
	}

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
						{isOwnerVerified && (
							<Note>
								<span>
									{formatMessage({
										id: 'label.note',
									}) + ' '}
								</span>
								{formatMessage({
									id: 'project.givback_toast.description.verified_owner.note',
								})}
							</Note>
						)}
						{link && (
							<ExternalLink href={link}>
								<LearnMore>
									{formatMessage({ id: 'label.learn_more' })}
									<IconChevronRight size={24} />
								</LearnMore>
							</ExternalLink>
						)}
					</div>
				</Content>
				{verified && (
					<ButtonWrapper>
						<OutlineButton
							onClick={handleBoostClick}
							label='Boost'
							icon={<IconRocketInSpace16 />}
						/>
					</ButtonWrapper>
				)}
			</Wrapper>
			{showBoost && (
				<BoostModal
					projectId={projectData?.id!}
					setShowModal={setShowBoost}
				/>
			)}
		</>
	);
};

const Note = styled(P)`
	color: ${neutralColors.gray[800]};
	> span {
		font-weight: 500;
	}
`;

const LearnMore = styled(Caption)`
	display: flex;
	gap: 2px;
	color: ${brandColors.pinky[500]};
`;

const Description = styled(P)`
	margin: 4px 0;
	color: ${neutralColors.gray[900]};
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
		width: 194px;
		svg {
			margin-right: 8px;
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
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export default ProjectGIVbackToast;
