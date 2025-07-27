import { FC, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Flex,
	H6,
	IconGIVBack16,
	IconVerifiedBadge16,
	IconExternalLink16,
	neutralColors,
	P,
	semanticColors,
	Subline,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { IProject } from '@/apollo/types/types';
import { Shadow } from '@/components/styled-components/Shadow';
import { slugToProjectView } from '@/lib/routeCreators';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { ProjectCardUserName } from '@/components/project-card/ProjectCardUserName';
import { getActiveRound } from '@/helpers/qf';
import { ProjectCardTotalRaised } from '@/components/project-card/ProjectCardTotalRaised';
import { ProjectCardTotalRaisedQF } from '@/components/project-card/ProjectCardTotalRaisedQF';
import config from '@/configuration';

const SIDE_PADDING = '26px';

export const CauseCreateProjectCard: FC<{
	project: IProject;
	isSelected?: boolean;
	onProjectSelect?: (project: IProject[]) => void;
	selectedProjects?: IProject[];
	showErrorModal?: (show: boolean) => void;
	showOptions?: boolean;
}> = ({
	project,
	isSelected = false,
	onProjectSelect,
	selectedProjects,
	showErrorModal,
	showOptions = true,
}) => {
	const { formatMessage } = useIntl();
	const {
		title,
		descriptionSummary,
		slug,
		adminUser,
		totalDonations,
		sumDonationValueUsdForActiveQfRound,
		organization,
		verified,
		isGivbackEligible,
		countUniqueDonors,
		qfRounds,
		countUniqueDonorsForActiveQfRound,
	} = project;

	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;
	const name = adminUser?.name;
	const { activeStartedRound } = getActiveRound(qfRounds);
	const hasFooter = activeStartedRound || verified || isGivbackEligible;
	const showVerifiedBadge = verified || isGivbackEligible;

	const projectLink = slugToProjectView(slug);

	const [isHover, setIsHover] = useState(false);

	// Handle checkbox change
	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		if (onProjectSelect) {
			if (e.target.checked) {
				// Don't allow to select more than defined max projects
				if (
					(selectedProjects?.length || 0) >=
					config.CAUSES_CONFIG.maxSelectedProjects
				) {
					showErrorModal?.(true);
					return;
				}
				onProjectSelect([...(selectedProjects || []), project]);
			} else {
				onProjectSelect(
					selectedProjects?.filter((selectedProject: IProject) => {
						return selectedProject.id !== project.id;
					}) as IProject[],
				);
			}
		}
	};

	return (
		<Wrapper
			onMouseEnter={() => {
				setIsHover(true);
			}}
			onMouseLeave={() => {
				setIsHover(false);
			}}
			$showOptions={showOptions}
		>
			<CardBody $isOtherOrganization={isForeignOrg}>
				<TitleWrapper>
					<TitleRow>
						<Title weight={700}>{title}AAAA</Title>
						{showOptions && (
							<ProjectCheckbox
								type='checkbox'
								checked={isSelected}
								onChange={handleCheckboxChange}
								$isSelected={isSelected}
							/>
						)}
					</TitleRow>
				</TitleWrapper>
				<ProjectCardUserName
					name={name}
					adminUser={adminUser}
					slug={slug}
					isForeignOrg={isForeignOrg}
				/>
				<Description>{descriptionSummary}</Description>
				{showOptions && (
					<PaddedRow $justifyContent='space-between'>
						{!activeStartedRound && (
							<ProjectCardTotalRaised
								activeStartedRound={!!activeStartedRound}
								totalDonations={totalDonations || 0}
								sumDonationValueUsdForActiveQfRound={
									sumDonationValueUsdForActiveQfRound || 0
								}
								countUniqueDonors={countUniqueDonors || 0}
								isCause={false}
							/>
						)}
						{activeStartedRound && (
							<ProjectCardTotalRaisedQF
								activeStartedRound={!!activeStartedRound}
								totalDonations={totalDonations || 0}
								sumDonationValueUsdForActiveQfRound={
									sumDonationValueUsdForActiveQfRound || 0
								}
								countUniqueDonors={
									countUniqueDonorsForActiveQfRound || 0
								}
								isCause={true}
								projectsCount={
									project.causeProjects?.length || 0
								}
							/>
						)}
					</PaddedRow>
				)}
				{hasFooter && (
					<>
						<Hr />
						<PaddedRow $justifyContent='space-between'>
							<Flex gap='16px' $flexWrap={true}>
								{showVerifiedBadge && (
									<Flex $alignItems='center' gap='4px'>
										<IconVerifiedBadge16
											color={semanticColors.jade[500]}
										/>
										<VerifiedText>
											{formatMessage({
												id: 'label.verified',
											})}
										</VerifiedText>
									</Flex>
								)}
								{isGivbackEligible && (
									<Flex $alignItems='center' gap='4px'>
										<IconGIVBack16
											color={brandColors.giv[500]}
										/>
										<GivbackEligibleText>
											GIVbacks
										</GivbackEligibleText>
									</Flex>
								)}
								{activeStartedRound && (
									<QFBadge>
										{activeStartedRound?.name}
									</QFBadge>
								)}
							</Flex>
						</PaddedRow>
					</>
				)}
			</CardBody>
			{isHover && showOptions && (
				<CardBodyHover $isHover={isHover}>
					<Link
						href={projectLink}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Flex $alignItems='center' gap='8px'>
							{formatMessage({
								id: 'label.learn_more',
							})}
							<IconExternalLink16 />
						</Flex>
					</Link>
				</CardBodyHover>
			)}
		</Wrapper>
	);
};

interface IWrapperProps {
	$order?: number;
	$activeStartedRound?: boolean;
	$showOptions?: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
	position: relative;
	width: ${props => (props.$showOptions ? '50%' : '100%')};
	border-radius: 12px;
	margin: 4px 0 0 0;
	background: white;
	overflow: hidden;
	box-shadow: ${props => (props.$showOptions ? Shadow.Neutral[400] : 'none')};
	order: ${props => props.$order};
	min-height: ${props => (props.$showOptions ? '326px' : '200px')};
	transition: all 0.5s ease;
	transform: translateY(0);

	&:hover {
		transform: ${props =>
			props.$showOptions ? 'translateY(-8px) scale(1.02)' : 'none'};
		box-shadow: ${props =>
			props.$showOptions ? Shadow.Neutral[500] : 'none'};
	}
`;

interface ICardBody {
	$isOtherOrganization?: boolean | '';
}

const CardBody = styled.div<ICardBody>`
	background-color: ${neutralColors.gray[100]};
	transition: top 0.3s ease;
	border-radius: ${props =>
		props.$isOtherOrganization ? '0 12px 12px 12px' : '12px'};

	transition: all 0.5s ease;

	a {
		pointer-events: none;
	}

	span {
		color: ${neutralColors.gray[800]};
	}
`;

const TitleWrapper = styled.div`
	padding: 32px ${SIDE_PADDING} 0;
	position: relative;
`;

const TitleRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 12px;
`;

const Title = styled(H6)`
	overflow: hidden;
	margin-bottom: 2px;
	flex: 1;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
`;

const ProjectCheckbox = styled.input<{ $isSelected: boolean }>`
	width: 24px;
	height: 24px;
	cursor: pointer;
	margin-top: 2px;
	flex-shrink: 0;

	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

	border: 2px solid ${neutralColors.gray[900]};
	border-radius: 4px;
	background-color: ${props =>
		props.$isSelected ? neutralColors.gray[900] : 'white'};
	transition: all 0.2s ease;
	position: relative;

	&:hover {
		border-color: ${brandColors.giv[500]};
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}

	&::after {
		content: ${props => (props.$isSelected ? "'✓'" : "''")};
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 16px;
		font-weight: bold;
		line-height: 1;
	}
`;

const Description = styled(P)`
	padding: 0 ${SIDE_PADDING};
	height: 75px;
	overflow: hidden;
	color: ${neutralColors.gray[800]};
	margin-bottom: 24px;
`;

interface IPaddedRowProps {
	$sidePadding?: string;
}

export const PaddedRow = styled(Flex)<IPaddedRowProps>`
	padding: 0 ${props => props.$sidePadding || SIDE_PADDING};
	padding-bottom: 6px;
`;

const Hr = styled.hr`
	height: 1px;
	margin-left: ${SIDE_PADDING};
	margin-right: ${SIDE_PADDING};
	border: none;
	border-top: 1px solid ${neutralColors.gray[300]};
`;

const VerifiedText = styled(Subline)`
	color: ${semanticColors.jade[500]};
`;

const GivbackEligibleText = styled(Subline)`
	color: ${brandColors.giv[500]};
`;

const QFBadge = styled(Subline)`
	background-color: ${brandColors.cyan[600]};
	color: ${neutralColors.gray[100]};
	padding: 4px 8px;
	border-radius: 16px;
	display: flex;
	align-items: center;
`;
interface ICardBodyHoverProps {
	$isHover?: boolean;
}

const CardBodyHover = styled.div<ICardBodyHoverProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 32px 16px;
	margin-top: 10px;
	margin-left: ${SIDE_PADDING};
	margin-right: ${SIDE_PADDING};
	border-top: 1px solid ${neutralColors.gray[300]};

	transition: all 0.5s ease;

	animation: slideIn 0.3s ease;

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	a {
		transition: color 0.3s ease;
		text-decoration: none;
		color: ${brandColors.giv[300]};
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;

		&:hover {
			color: ${brandColors.giv[100]};
		}
	}
`;
