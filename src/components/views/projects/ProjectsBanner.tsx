import React, { FC } from 'react';
import styled from 'styled-components';
import {
	H1,
	neutralColors,
	semanticColors,
	SemiTitle,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { IMainCategory } from '@/apollo/types/types';
import { FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { useProjectsContext } from '@/context/projects.context';

interface IProjectsBanner {
	mainCategory?: IMainCategory;
}

export const ProjectsBanner: FC<IProjectsBanner> = ({ mainCategory }) => {
	const { formatMessage } = useIntl();

	const allCategory = {
		title: formatMessage({ id: 'label.giveth_projects' }),
		banner: '/images/banners/categories/all.png',
		slug: 'all_projects',
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
			<Title weight={700} color={neutralColors.gray[100]}>
				{formatMessage({ id: _mainCategory.slug })}
			</Title>
			<Desc color={neutralColors.gray[100]}>
				{formatMessage({ id: `${_mainCategory.slug}_desc` })}
			</Desc>
		</BannerContainer>
	);
};

export const QFProjectsBanner: FC<IProjectsBanner> = () => {
	const { formatMessage } = useIntl();
	const { qfRounds } = useProjectsContext();

	return (
		<BannerContainer direction='column'>
			<Image
				src={'/images/banners/qfBanner.png'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Title weight={700} color={semanticColors.golden[500]}>
				{/* {formatMessage({ id: _mainCategory.slug })} */}
				hi
			</Title>
			<Desc color={semanticColors.jade[100]}>Babe</Desc>
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

interface IColor {
	color: string;
}

const Title = styled(H1)<IColor>`
	z-index: 1;
	color: ${props => props.color};
	margin-bottom: 32px;
`;

const Desc = styled(SemiTitle)<IColor>`
	z-index: 1;
	color: ${props => props.color};
	text-transform: uppercase;
`;
