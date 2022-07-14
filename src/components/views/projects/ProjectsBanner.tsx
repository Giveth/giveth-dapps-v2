import React, { FC } from 'react';
import styled from 'styled-components';
import { H1, SemiTitle } from '@giveth/ui-design-system';
import { IMainCategory } from '@/apollo/types/types';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IProjectsBanner {
	mainCategory?: IMainCategory;
}

const allCategory = {
	title: 'Giveth Projects',
	banner: '/images/banners/categories/all.png',
	slug: 'Explore awesome projects on Giveth and support',
	description: '',
	categories: [],
};

const ProjectsBanner: FC<IProjectsBanner> = ({ mainCategory }) => {
	const _mainCategory = mainCategory ?? allCategory;
	return (
		<BannerContainer direction='column'>
			{/* <Image
				src={_mainCategory.banner}
				layout='fill'
				alt={_mainCategory.title}
			/> */}
			<H1>{_mainCategory.title}</H1>
			<SemiTitle>{_mainCategory.description}</SemiTitle>
		</BannerContainer>
	);
};

const BannerContainer = styled(FlexCenter)`
	width: 100%;
	height: 540px;
	position: relative;
`;

export default ProjectsBanner;
