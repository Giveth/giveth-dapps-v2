import { neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

export const ProjectScoreCard = () => {
	return <Container>projectScoreCard</Container>;
};

const Container = styled.div`
	position: sticky;
	top: 100px;
	width: 400px;
	padding: 24px;
	margin-top: 80px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
`;
