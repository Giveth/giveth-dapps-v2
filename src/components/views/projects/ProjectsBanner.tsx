import React, { FC } from 'react';
import { IMainCategory } from '@/apollo/types/types';

interface IProjectsBanner {
	mainCategory: IMainCategory;
}

const ProjectsBanner: FC<IProjectsBanner> = ({ mainCategory }) => {
	return <div>{mainCategory.title}</div>;
};

export default ProjectsBanner;
