import Image from 'next/image';
import React, { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	H6,
	neutralColors,
	P,
	SublineBold,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { Flex } from '@/components/styled-components/Flex';
import { IProjectUpdateWithProject } from '@/apollo/types/types';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';
import Routes from '@/lib/constants/Routes';
import { EProjectPageTabs } from '../../project/ProjectIndex';

interface ILatestUpdateCardProps {
	update: IProjectUpdateWithProject;
}

export const LatestUpdateCard: FC<ILatestUpdateCardProps> = ({ update }) => {
	return (
		<Link
			href={`${Routes.Project}/${update.project.slug}?tab=${EProjectPageTabs.UPDATES}`}
		>
			<LatestUpdateCardContainer>
				<ImageWrapper>
					{update.project.image && (
						<Image
							fill
							src={update.project.image || ''}
							alt=''
							style={{ objectFit: 'cover' }}
						/>
					)}
				</ImageWrapper>
				<Content>
					<Time>
						{durationToString(
							getNowUnixMS() -
								new Date(update.createdAt).getTime(),
							1,
						) + ' ago'}
					</Time>
					<Title>{update.title}</Title>
					<Desc>{update.contentSummary}</Desc>
				</Content>
			</LatestUpdateCardContainer>
		</Link>
	);
};

const LatestUpdateCardContainer = styled(Flex)`
	gap: 16px;
	margin-right: 16px;
`;

const ImageWrapper = styled.div`
	width: 96px;
	height: 96px;
	overflow: hidden;
	position: relative;
	border-radius: 8px;
	background-color: ${brandColors.giv[500]};
`;

const Content = styled.div`
	width: 326px;
`;

const Time = styled(SublineBold)`
	padding: 2px 12px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
	display: inline-block;
`;

const Title = styled(H6)`
	text-overflow: ellipsis;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const Desc = styled(P)`
	height: 48px;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	white-space: normal;
	& > p {
		margin: 0;
	}
`;
