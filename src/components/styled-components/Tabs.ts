import { P, brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from './Flex';

export interface ITab {
	active: boolean;
}

export const TabsContainer = styled(Flex)`
	padding: 37px 0;
	gap: 16px;
	overflow: auto;
`;

export const TabItem = styled(P)<ITab>`
	display: flex;
	align-items: center;
	padding: 9px 10px;
	word-break: break-word;
	white-space: nowrap;
	cursor: pointer;
	color: ${(props: ITab) =>
		props.active ? brandColors.deep[600] : brandColors.pinky[500]};
	${props =>
		props.active &&
		`
		background: ${neutralColors.gray[100]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
	`}
`;

export const TabItemCount = styled.div<ITab>`
	background-color: ${brandColors.pinky[500]};
	color: white;
	width: 24px;
	height: 24px;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	margin-left: 4px;
`;
