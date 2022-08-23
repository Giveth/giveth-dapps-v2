import { Container, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const NotificationContainer = styled(Container)`
	margin-top: 176px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
`;

export const NotificationTitle = styled.div`
	padding: 24px;
`;
