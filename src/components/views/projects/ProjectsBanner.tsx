import React, { FC } from 'react';
import styled from 'styled-components';
import { H1, neutralColors, SemiTitle } from '@giveth/ui-design-system';
import Image from 'next/image';
import { IMainCategory } from '@/apollo/types/types';
import { FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

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
			<Image
				//TODO: Should Update src when backend returns it
				src={'/images/banners/categories/art.png'}
				layout='fill'
				alt={_mainCategory.title}
				objectFit='cover'
				objectPosition='left'
			/>
			<Title weight={700}>{_mainCategory.title}</Title>
			<Desc>{_mainCategory.description}</Desc>
		</BannerContainer>
	);
};

const BannerContainer = styled(FlexCenter)`
	height: 0;
	position: relative;
	margin-top: 32px;
	overflow: hidden;

	${mediaQueries.tablet} {
		margin-top: 0;
		height: 540px;
	}
`;

const Title = styled(H1)`
	z-index: 1;
	color: ${neutralColors.gray[100]};
	margin-bottom: 32px;
`;

const Desc = styled(SemiTitle)`
	z-index: 1;
	color: ${neutralColors.gray[100]};
`;

export default ProjectsBanner;
