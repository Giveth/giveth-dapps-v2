import { Container, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

export const NotificationContainer = styled(Container)`
	margin-top: 176px;
	margin-bottom: 267px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
`;

export const IconContainer = styled.div`
	padding-top: 10px;
`;

export const NotificationHeader = styled(Flex)`
	padding: 24px;
`;

export const NotificationDesc = styled.div`
	margin-top: 16px;
`;

export const GrayBar = styled.div`
	width: 100%;
	border-bottom: 3px solid ${neutralColors.gray[300]};
`;

export const GrayBarTiny = styled.div`
	width: 100%;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

export const ConfigContainer = styled(FlexCenter)`
	position: relative;
	background: ${neutralColors.gray[200]};
	border-radius: 8px;
	padding: 10px;
	cursor: pointer;
`;

export const NotificationsInnerMenuContainer = styled.div`
	padding: 24px 50px 24px 16px;
	position: absolute;
	top: 55px;
	right: 0;
	box-shadow: ${Shadow.Neutral[400]};
	border-radius: 8px;
	white-space: nowrap;
`;
