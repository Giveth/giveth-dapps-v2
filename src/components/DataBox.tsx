import { brandColors, H4, Lead } from '@giveth/ui-design-system';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Flex } from './styled-components/Flex';

interface IDataBoxProps {
	title: string;
	children: ReactNode;
	button: ReactNode;
	className?: string;
}

const DataBoxContainer = styled(Flex)`
	flex-direction: column;
	padding: 24px 24px 60px;
	border-radius: 8px;
	background-color: ${brandColors.giv[600]};
	background-image: url('/images/backgrounds/GIVGIVGIV.png');
`;

const Title = styled(H4)`
	margin-bottom: 18px;
`;

const Body = styled(Lead)`
	margin-bottom: 16px;
	flex: 1;
	color: ${brandColors.giv[100]};
`;

export const DataBox: FC<IDataBoxProps> = ({
	title,
	children,
	button,
	className,
}) => {
	return (
		<DataBoxContainer className={className}>
			<Title weight={700}>{title}</Title>
			<Body> {children} </Body>
			{button}
		</DataBoxContainer>
	);
};
