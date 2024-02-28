import React, { FC } from 'react';
import styled from 'styled-components';
import {
	H1,
	neutralColors,
	SemiTitle,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { IMainCategory } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';

interface IProjectsBanner {
	mainCategory?: IMainCategory;
}

export const ProjectsBanner: FC<IProjectsBanner> = ({ mainCategory }) => {
	const { formatMessage } = useIntl();

	const allCategory = {
		title: formatMessage({ id: 'label.giveth_projects' }),
		banner: '/images/banners/categories/all.png',
		slug: 'all',
		description: '',
		categories: [],
	};

	const _mainCategory = mainCategory ?? allCategory;

	return (
		<BannerContainer direction='column'>
			<Image
				src={
					mainCategory?.banner || '/images/banners/categories/all.png'
				}
				fill
				alt={_mainCategory.title}
			/>
			<Title weight={700}>
				{formatMessage({ id: `projects_${_mainCategory.slug}` })}
			</Title>
			<Desc>
				{formatMessage({ id: `projects_${_mainCategory.slug}_desc` })}
			</Desc>
		</BannerContainer>
	);
};

export const BannerContainer = styled(FlexCenter)`
	height: 0;
	position: relative;
	overflow: hidden;
	${mediaQueries.tablet} {
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
	text-transform: uppercase;
`;
