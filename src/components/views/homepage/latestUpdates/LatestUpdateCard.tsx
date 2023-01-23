import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { neutralColors, SublineBold } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';

export const LatestUpdateCard = () => {
	return (
		<LatestUpdateCardContainer>
			<Image width={98} height={98} src='' alt='' />
			<Content>
				<Time>4 hours ago</Time>
			</Content>
		</LatestUpdateCardContainer>
	);
};

const LatestUpdateCardContainer = styled.div``;

const Content = styled(Flex)`
	margin-left: 16px;
`;

const Time = styled(SublineBold)`
	padding: 2px 12px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
`;
