import { B, Flex, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useProjectContext } from '@/context/project.context';
import ProjectSocialItem from './ProjectSocialItem';
import { IProjectSocialMedia } from '@/apollo/types/types';

const ProjectSocials = () => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();

	return (
		<div>
			<B>
				{formatMessage({
					id: 'label.social_find_us_on',
				})}
			</B>
			<br />
			<Flex gap='24px' $flexWrap>
				{projectData?.socialMedia?.map(
					(social: IProjectSocialMedia) => (
						<>
							<ProjectSocialItem
								key={social.link}
								socialMedia={social}
							/>
						</>
					),
				)}
			</Flex>
			<SocialWarning>
				{formatMessage({
					id: 'label.social_warning',
				})}
			</SocialWarning>
		</div>
	);
};

export default ProjectSocials;

const SocialWarning = styled.div`
	margin-top: 16px;
	color: ${neutralColors.gray[800]};
	font-size: 0.9rem;
	font-style: italic;
`;
