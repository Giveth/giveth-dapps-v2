import { FC, useState } from 'react';
import {
	brandColors,
	IconRocketInSpace,
	IconShare16,
	neutralColors,
	Flex,
} from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { IProject } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { useModalCallback } from '@/hooks/useModalCallback';
import { EContentType } from '@/lib/constants/shareContent';
import ShareModal from '../modals/ShareModal';
import BoostModal from '../modals/Boost/BoostModal';
import { EProjectType } from '@/apollo/types/gqlEnums';

interface IProjectCardBadgeButtons {
	project: IProject;
}

const ProjectCardBadgeButtons: FC<IProjectCardBadgeButtons> = ({ project }) => {
	const [showShare, setShowShare] = useState(false);
	const [showBoost, setShowBoost] = useState(false);
	const { slug, verified, projectType } = project;
	const { isSignedIn, isEnabled } = useAppSelector(state => state.user);
	const { open: openConnectModal } = useWeb3Modal();

	const showBoostModal = () => {
		setShowBoost(true);
	};

	const { modalCallback: signInThenBoost } = useModalCallback(showBoostModal);
	const checkSignInThenBoost = () => {
		if (!isEnabled) {
			openConnectModal?.();
		} else if (!isSignedIn) {
			signInThenBoost();
		} else {
			setShowBoost(true);
		}
	};

	return (
		<>
			{showShare && (
				<ShareModal
					setShowModal={setShowShare}
					projectHref={slug}
					contentType={EContentType.thisProject}
					isCause={projectType === EProjectType.CAUSE}
					{...(projectType === EProjectType.CAUSE
						? {
								cause: project as any,
								numberOfProjects:
									(project as any)?.activeProjectsCount ??
									(project as any)?.fullCauseProject
										?.activeProjectsCount ??
									0,
							}
						: {})}
				/>
			)}

			<BadgeWrapper>
				<Flex gap='6px'>
					{verified && (
						<BadgeButton onClick={checkSignInThenBoost}>
							<IconRocketInSpace />
						</BadgeButton>
					)}
					<BadgeButton
						onClick={() => {
							setShowShare(true);
						}}
					>
						<IconShare16 />
					</BadgeButton>
				</Flex>
			</BadgeWrapper>
			{showBoost && (
				<BoostModal
					projectId={project?.id!}
					setShowModal={setShowBoost}
				/>
			)}
		</>
	);
};

interface IBadgeButton {
	$isLoading?: boolean;
}

export const BadgeButton = styled(Flex)<IBadgeButton>`
	gap: 3px;
	padding: 6px 7px;
	z-index: 2;
	align-items: center;
	border-radius: 16px;
	cursor: pointer;
	transition: color 0.3s ease;
	color: ${neutralColors.gray[600]};
	box-shadow: 0 3px 20px ${brandColors.giv[400]}21;
	&:hover {
		color: ${neutralColors.gray[900]};
	}
	pointer-events: auto;
	position: relative;
	overflow: hidden;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 16px;
		z-index: -1;
		background-color: #ffffff;
	}
	${props =>
		props.$isLoading
			? css`
					&::before {
						content: '';
						position: absolute;
						top: -10px;
						bottom: -10px;
						left: -10px;
						right: -10px;
						z-index: -2;
						animation: rotate linear 1s infinite;
						background-color: #399953;
						background-repeat: no-repeat;
						background-size:
							50% 50%,
							50% 50%;
						background-position:
							0 0,
							100% 0,
							100% 100%,
							0 100%;
						background-image: linear-gradient(#ffffff, #ffffff),
							linear-gradient(#ffffff, #ffffff),
							linear-gradient(#ffffff, #ffffff),
							linear-gradient(
								${brandColors.giv[500]},
								${brandColors.giv[500]}
							);
					}
					&::after {
						top: 2px;
						bottom: 2px;
						left: 2px;
						right: 2px;
					}
				`
			: ``}

	@keyframes rotate {
		100% {
			transform: rotate(1turn);
		}
	}
`;

const BadgeWrapper = styled.div`
	width: 100%;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: flex-end;
	padding: 16px;
	pointer-events: none;
`;

export default ProjectCardBadgeButtons;
