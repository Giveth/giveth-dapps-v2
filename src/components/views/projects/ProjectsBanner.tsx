import React, { FC } from 'react';
import styled from 'styled-components';
import { IMainCategory } from '@/apollo/types/types';

interface IProjectsBanner {
	mainCategory?: IMainCategory;
}

const ProjectsBanner: FC<IProjectsBanner> = ({ mainCategory }) => {
	return <div>{mainCategory?.title}</div>;
};

const BannerContainer = styled.div``;

export default ProjectsBanner;
