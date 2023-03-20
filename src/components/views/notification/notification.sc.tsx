import { Button, Container, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';

import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { TabItem } from '@/components/styled-components/Tabs';

export const NotificationContainer = styled(Container)`
	margin-top: 70px;
	margin-bottom: 267px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
	padding: 24px;
`;

export const IconContainer = styled.div`
	padding-top: 10px;
`;

export const NotificationDesc = styled(Flex)`
	width: 100%;
	margin-top: 2px;
	gap: 16px;
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
	background: ${neutralColors.gray[200]};
	border-radius: 8px;
	padding: 10px;
	cursor: pointer;
`;

export const NotifisTabItem = styled(TabItem)`
	color: ${neutralColors.gray[900]};
	user-select: none;
	${props =>
		props.active &&
		`
		background: ${neutralColors.gray[300]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
		padding: 9px 16px;
	`}
`;

export const NotifsHr = styled.hr`
	margin-bottom: 13px;
`;

export const Loading = styled(FlexCenter)`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	height: 100%;
	width: 100%;
	background-color: gray;
	transition: opacity 0.3s ease-in-out;
	opacity: 0.9;
`;

export const MarkAllNotifsButton = styled(Button)`
	align-self: baseline;
	${mediaQueries.tablet} {
		align-self: auto;
	}
`;
