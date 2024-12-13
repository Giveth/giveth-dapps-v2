import React from 'react';
import styled from 'styled-components';
import {
	H1,
	neutralColors,
	SemiTitle,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { mediaQueries } from '@/lib/constants/constants';
import { useProjectsContext } from '@/context/projects.context';

export const ProjectsBanner = () => {
	const { formatMessage } = useIntl();
	const { selectedMainCategory } = useProjectsContext();

	const allCategory = {
		title: formatMessage({ id: 'label.giveth_projects' }),
		banner: '/images/banners/categories/all.png',
		slug: 'all',
		description: '',
		categories: [],
	};

	const _mainCategory = selectedMainCategory ?? allCategory;

	return (
		<BannerContainer direction='column'>
			<Image
				src={
					selectedMainCategory?.banner ||
					'/images/banners/categories/all.png'
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
	color: ${neutralColors.gray[100]} !important;
	margin-bottom: 32px !important;
`;

const Desc = styled(SemiTitle)`
	z-index: 1;
	color: ${neutralColors.gray[100]} !important;
	text-transform: uppercase;
	max-width: 800px;
	text-align: center;
	line-height: 30px;
	padding: 0 30px;
`;
