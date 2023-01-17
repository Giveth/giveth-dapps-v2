import {
	brandColors,
	neutralColors,
	Overline,
	GLink,
	B,
	P,
	Caption,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Flex } from '../styled-components/Flex';

export const RewardMenuItem = styled(Flex)<{ isHighlighted?: boolean }>`
	padding: 8px;
	gap: 6px;
	flex-direction: column;
	border-radius: 8px;
	background-color: ${props =>
		props.isHighlighted
			? props.theme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[200]
			: 'unset'};
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[800]
				: neutralColors.gray[200]};
	}
`;

export const RewardMenuTitle = styled(Overline)`
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[300]
			: neutralColors.gray[800]};
`;

export const NetworkRow = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

export const SwitchNetwork = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export const FlowrateRow = styled(Flex)`
	align-items: center;
	margin-top: 8px;
	gap: 4px;
`;

export const FlowrateAmount = styled(B)`
	padding-left: 4px;
`;

export const FlowrateUnit = styled(P)`
	color: ${brandColors.deep[100]};
`;

export const PartAmount = styled(Caption)``;
export const PartUnit = styled(Caption)``;

export const IconHelpWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.deep[100]};
`;
