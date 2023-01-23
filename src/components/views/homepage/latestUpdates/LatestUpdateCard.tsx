import Image from 'next/image';
import React, { FC } from 'react';
import styled from 'styled-components';
import { H6, neutralColors, P, SublineBold } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { IProjectUpdate } from '@/apollo/types/types';

interface ILatestUpdateCardProps {
	projectUpdate: IProjectUpdate;
	cover: string;
}

export const LatestUpdateCard: FC<ILatestUpdateCardProps> = ({
	projectUpdate,
	cover,
}) => {
	return (
		<LatestUpdateCardContainer>
			<Image width={98} height={98} src='' alt='' />
			<Content>
				<Time>{projectUpdate.createdAt}</Time>
				<Title>{projectUpdate.title}</Title>
				<Desc
					dangerouslySetInnerHTML={{ __html: projectUpdate.content }}
				/>
			</Content>
		</LatestUpdateCardContainer>
	);
};

const LatestUpdateCardContainer = styled(Flex)`
	gap: 16px;
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
`;
