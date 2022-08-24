import { B, neutralColors, P } from '@giveth/ui-design-system';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface ISectionItem {
	title: string;
	description: string;
	options: ReactNode;
}

export const SectionItem: FC<ISectionItem> = props => {
	const { title, description, options } = props;
	return (
		<Container>
			<Left>
				<Title>{title}</Title>
				<Description>{description}</Description>
			</Left>
			<Right>{options}</Right>
		</Container>
	);
};

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 40px;
	display: flex;
	justify-content: space-between;
`;

const Left = styled.div``;
const Right = styled.div``;

const Title = styled(B)`
	margin-bottom: 10px;
`;

const Description = styled(P)`
	color: ${neutralColors.gray[700]};
`;
