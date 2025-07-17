import { useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	IconTrash16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { IProject } from '@/apollo/types/types';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import config from '@/configuration';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

export const CauseSelectedProjects = () => {
	const { watch, setValue } = useFormContext();
	const selectedProjects = watch('selectedProjects') || [];
	const { formatMessage } = useIntl();

	const handleRemoveProject = (projectToRemove: IProject) => {
		const updatedProjects = selectedProjects.filter(
			(project: IProject) => project.id !== projectToRemove.id,
		);
		setValue('selectedProjects', updatedProjects);
	};

	return (
		<Container>
			<Header>
				<HeaderTitle>
					{formatMessage({ id: 'label.cause.select_projects' })}
				</HeaderTitle>
				<Counter>
					{selectedProjects.length}/
					{config.CAUSES_CONFIG.maxSelectedProjects}
				</Counter>
			</Header>

			<InfoBox>
				<InlineToast
					type={EToastType.Info}
					title={formatMessage({ id: 'label.how_it_works' })}
					message={
						<FormattedMessage
							id='label.cause.selected_projects_info_desc'
							values={{
								link: (chunks: React.ReactNode) => (
									<Link
										href='https://docs.giveth.io/donation-agents'
										target='_blank'
									>
										{chunks}
									</Link>
								),
							}}
						/>
					}
				/>
			</InfoBox>

			<ProjectsList>
				{selectedProjects.map((project: IProject) => {
					// Check does cause have some projects that has been not active
					// or missing network 137 address
					const isInactiveOrUnverifiedAndIncluded =
						project.status?.name !== EProjectStatus.ACTIVE ||
						!project.verified;

					const isMissingNetwork137 = !project.addresses?.some(
						address => address.networkId === 137,
					);

					const shouldShowWarning =
						isInactiveOrUnverifiedAndIncluded ||
						isMissingNetwork137;

					return (
						<ProjectItem key={project.id}>
							{shouldShowWarning ? (
								<InlineToastWrapper
									type={EToastType.Warning}
									message={formatMessage({
										id: 'label.cause.project_deactivated_notice',
									})}
								/>
							) : null}
							<ProjectInfo>
								<ProjectTitle>{project.title}</ProjectTitle>
								<ProjectCategory>
									{project.categories?.[0]?.mainCategory
										?.title || 'Uncategorized'}
								</ProjectCategory>
							</ProjectInfo>
							<RemoveButton
								onClick={() => handleRemoveProject(project)}
								aria-label='Remove project'
							>
								<IconTrash16 />
							</RemoveButton>
						</ProjectItem>
					);
				})}
			</ProjectsList>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 8px;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
	margin-top: 139px;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const HeaderTitle = styled.div`
	font-size: 18px;
	font-weight: 700;
	color: ${neutralColors.gray[900]};
	text-transform: lowercase;
	&::first-letter {
		text-transform: uppercase;
	}
`;

const Counter = styled.div`
	background-color: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 500;
`;

const InfoBox = styled.div`
	display: block;

	a {
		color: ${brandColors.giv[300]};
	}

	a:hover {
		text-decoration: underline;
	}
`;

const ProjectsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const ProjectItem = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	background-color: white;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${brandColors.giv[300]};
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
`;

const ProjectInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
`;

const ProjectTitle = styled.div`
	font-weight: 600;
	font-size: 16px;
	color: ${neutralColors.gray[900]};
`;

const ProjectCategory = styled.div`
	font-size: 14px;
	color: ${neutralColors.gray[600]};
`;

const RemoveButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	border-radius: 4px;
	color: ${neutralColors.gray[600]};
	transition: all 0.2s ease;

	&:hover {
		background-color: ${neutralColors.gray[200]};
		color: ${neutralColors.gray[900]};
	}
`;

const InlineToastWrapper = styled(InlineToast)`
	width: 100%;
`;
