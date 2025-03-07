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
		banner: '/images/banners/categories/all-new.png',
		slug: 'all',
		description: '',
		categories: [],
	};

	const _mainCategory = selectedMainCategory ?? allCategory;

	// It wont show title and description from the database because
	// we are using here on the FE translations

	return (
		<BannerContainer direction='column'>
			<Image
				src={
					selectedMainCategory?.banner ||
					'/images/banners/categories/all-new.png'
				}
				fill
				objectFit='cover'
				objectPosition='center'
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
	margin-bottom: 0;
	align-items: start !important;
	padding: 0 4em;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	${mediaQueries.tablet} {
		height: 260px;
		margin-bottom: -50px;
	}
`;

const Title = styled(H1)`
	position: relative;
	margin-top: -30px;
	z-index: 1;
	font-size: 52px;
	line-height: 72px;
	color: ${neutralColors.gray[100]} !important;
	margin-bottom: 10px !important;
`;

const Desc = styled(SemiTitle)`
	z-index: 1;
	font-weight: 500;
	color: ${neutralColors.gray[100]} !important;
	max-width: 800px;
	text-align: left;
	text-transform: none !important;
	font-size: 24px !important;
	line-height: 30px !important;
`;
