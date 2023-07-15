import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	IconChevronRight,
	IconGIVBack,
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
import { Flex } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { useProjectContext } from '@/context/project.context';
import { EModalEvents, useModalCallback } from '@/hooks/useModalCallback';
import { isSSRMode } from '@/lib/helpers';
import BoostModal from '@/components/modals/Boost/BoostModal';
import { useAppSelector } from '@/features/hooks';

const ProjectGIVbackToast = () => {
	const { projectData, isAdmin } = useProjectContext();
	const verified = projectData?.verified;
	const { givbackFactor } = projectData || {};
	const isOwnerVerified = verified && isAdmin;
	const isOwnerNotVerified = !verified && isAdmin;
	const isPublicVerified = verified && !isAdmin;
	const color = isOwnerVerified
		? semanticColors.golden[600]
		: neutralColors.gray[900];
	const { formatMessage } = useIntl();

	const handleTitle = () => {
		if (isOwnerVerified) {
			if (givbackFactor === 0) return;
			return (
				formatMessage({
					id: `project.givback_toast.title.verified_owner_1`,
				}) +
				((givbackFactor || 0) * 100).toFixed(2) +
				'%' +
				formatMessage({
					id: `project.givback_toast.title.verified_owner_2`,
				})
			);
		} else if (isOwnerNotVerified) {
			return formatMessage({
				id: `project.givback_toast.title.non_verified_owner`,
			});
		} else if (isPublicVerified) {
			if (givbackFactor === 0) return;
			return (
				formatMessage({
					id: `project.givback_toast.title.verified_public_1`,
				}) +
				Math.round(+(givbackFactor || 0) * 100) +
				'%' +
				formatMessage({
					id: `project.givback_toast.title.verified_public_2`,
				})
			);
		} else {
			return formatMessage({
				id: `project.givback_toast.title.non_verified_public`,
			});
		}
	};

	const title = handleTitle();

	const description = formatMessage({
		id: `project.givback_toast.description.${
			isOwnerVerified
				? 'verified_owner'
				: isOwnerNotVerified
				? 'non_verified_owner'
				: isPublicVerified
				? 'verified_public'
				: 'non_verified_public'
		}`,
	});

	const [showBoost, setShowBoost] = useState(false);

	const {
		isEnabled,
		isSignedIn,
		isLoading: isUserLoading,
	} = useAppSelector(state => state.user);
	const router = useRouter();

	const showBoostModal = () => {
		setShowBoost(true);
	};

	const { modalCallback: signInThenBoost } = useModalCallback(showBoostModal);

	const { modalCallback: connectThenSign } = useModalCallback(
		signInThenBoost,
		EModalEvents.CONNECTED,
	);

	const handleBoostClick = () => {
		if (isSSRMode) return;
		if (!isEnabled) {
			connectThenSign();
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
					<IconGIVBack color={color} size={24} />
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
						<ExternalLink href={links.GIVBACK_DOC}>
							<LearnMore>
								{formatMessage({ id: 'label.learn_more' })}
								<IconChevronRight size={24} />
							</LearnMore>
						</ExternalLink>
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
	padding: 16px;
	background: #ffffff;
	border-radius: 16px;
	margin-top: 12px;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export default ProjectGIVbackToast;
