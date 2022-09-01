import { B, neutralColors, P } from '@giveth/ui-design-system';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Col, Row } from '@/components/Grid';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';

interface ISectionItem {
	title: string;
	description: string;
	options: ReactNode;
}

export const SectionItem: FC<ISectionItem> = props => {
	const { title, description, options } = props;
	return (
		<Container>
			<ColStyled xs={6} sm={7} md={8}>
				<Title>{title}</Title>
				<Description>{description}</Description>
			</ColStyled>
			<ColStyled xs={6} sm={5} md={4}>
				{options}
			</ColStyled>
		</Container>
	);
};

const ColStyled = styled(Col)`
	@media (max-width: ${deviceSize.mobileL}px) {
		width: 100%;
	}
`;

const Container = styled(Row)`
	padding-top: 40px;
	flex-direction: column;
	gap: 10px;
	${mediaQueries.mobileL} {
		flex-direction: row;
		gap: 0;
	}
`;

const Title = styled(B)`
	margin-bottom: 10px;
`;

const Description = styled(P)`
	color: ${neutralColors.gray[700]};
`;
