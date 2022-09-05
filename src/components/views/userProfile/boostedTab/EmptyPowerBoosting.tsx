import styled from 'styled-components';
import { ButtonLink, neutralColors, QuoteText } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';

export const EmptyPowerBoosting = () => {
	return (
		<EmptyPowerBoostingContainer direction='column'>
			<Title size='small'>
				You didn’t boost any project before!
				<br />
				Go to the projects and find a good project to boost
			</Title>
			<br />
			<ButtonLink
				label='Go to projects'
				href={Routes.Projects}
				size='small'
			/>
		</EmptyPowerBoostingContainer>
	);
};

const EmptyPowerBoostingContainer = styled(FlexCenter)`
	height: 630px;
`;

const Title = styled(QuoteText)`
	text-align: center;
	color: ${neutralColors.gray[800]};
`;
