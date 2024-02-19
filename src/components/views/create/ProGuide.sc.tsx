import { neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const Card = styled(Flex)`
	flex-direction: column;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	gap: 24px;
`;
