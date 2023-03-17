import React, { FC } from 'react';
import styled from 'styled-components';
import { H1, neutralColors, SemiTitle } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { IMainCategory } from '@/apollo/types/types';
import { FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

interface IProjectsBanner {
	mainCategory?: IMainCategory;
}

const ProjectsBanner: FC<IProjectsBanner> = ({ mainCategory }) => {
	const { formatMessage } = useIntl();

	const allCategory = {
		title: formatMessage({ id: 'label.giveth_projects' }),
		banner: '/images/banners/categories/all.png',
		slug: 'Explore awesome projects on Giveth and support',
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
				objectFit='cover'
				objectPosition='left'
			/>
			<Title weight={700}>
				{formatMessage({ id: _mainCategory.slug })}
			</Title>
			<Desc>{formatMessage({ id: `${_mainCategory.slug}_desc` })}</Desc>
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
	text-transform: uppercase;
`;

export default ProjectsBanner;
