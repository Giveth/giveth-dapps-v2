import { Container, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const NotificationContainer = styled(Container)`
	margin-top: 176px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
`;

export const IconContainer = styled.div`
	padding-top: 10px;
`;

export const NotificationTitle = styled(Flex)`
	padding: 24px;
`;
