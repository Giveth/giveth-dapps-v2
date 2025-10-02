import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { ICauseProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { mediaQueries } from '@/lib/constants/constants';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

export const CauseProjectsTab = ({
	causeProjects,
}: {
	causeProjects: ICauseProject[];
}) => {
	const { formatMessage } = useIntl();
	// List project cards
	return (
		<Wrapper>
			<CauseInlineToast
				type={EToastType.Hint}
				title={formatMessage({ id: 'label.cause.distributed_by_ai' })}
				message={formatMessage({
					id: 'label.cause.distributed_by_ai_desc_2',
				})}
			></CauseInlineToast>
			<ProjectsWrapper>
				<ProjectsContainer>
					{causeProjects.map(causeProject => (
						<ProjectCard
							key={causeProject.id}
							project={causeProject.project}
							amountReceived={causeProject.amountReceived}
							amountReceivedUsdValue={
								causeProject.amountReceivedUsdValue
							}
						/>
					))}
				</ProjectsContainer>
			</ProjectsWrapper>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	${mediaQueries.tablet} {
		padding-top: 33px;
		padding-bottom: 33px;
	}
	${mediaQueries.laptopS} {
		padding-top: 5px;
		padding-bottom: 40px;
	}
`;

export const ProjectsWrapper = styled.div`
	margin-bottom: 64px;
`;

export const ProjectsContainer = styled.div`
	display: grid;
	gap: 25px;
	padding: 0 23px;

	${mediaQueries.tablet} {
		padding: 0;
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export const CauseInlineToast = styled(InlineToast)`
	margin-bottom: 30px;
`;
