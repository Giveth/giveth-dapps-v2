import { Container, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { TabItem } from '@/components/styled-components/Tabs';

export const NotificationContainer = styled(Container)`
	margin-top: 176px;
	margin-bottom: 267px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
	padding: 24px;
`;

export const IconContainer = styled.div`
	padding-top: 10px;
`;

export const NotificationDesc = styled(Flex)`
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
	${props =>
		props.active &&
		`
		background: ${neutralColors.gray[300]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
		padding: 9px 16px;
	`}
`;
