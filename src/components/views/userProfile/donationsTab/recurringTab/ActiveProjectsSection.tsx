import { H5, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const ActiveProjectsSection = () => {
	return (
		<Wrapper>
			<Flex>
				<H5 weight={900}>Active projects</H5>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 12px;
`;
