import { B, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useProjectContext } from '@/context/project.context';
import ProjectSocialItem from './ProjectSocialItem';
import { IProjectSocialMedia } from '@/apollo/types/types';

const ProjectSocials = () => {
	const { projectData } = useProjectContext();

	return (
		<div>
			<B>Find us on Social Media </B>
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
		</div>
	);
};

export default ProjectSocials;
