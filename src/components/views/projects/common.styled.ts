import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';

export const StyledLine = styled.hr`
	width: 100%;
	border: 1px solid ${neutralColors.gray[200]};
`;

export const FiltersSection = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
	position: relative;
	color: ${neutralColors.gray[900]};
	justify-content: space-between;
	flex-wrap: nowrap;
`;

export const FiltersButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	border-radius: 50px;
	padding: 16px;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	border: 1px solid ${neutralColors.gray[400]};
	font-weight: 700;
	text-transform: uppercase;
	cursor: pointer;
	user-select: none;
`;

export const IconContainer = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: fit-content;
	height: fit-content;
	min-width: 42px;
	min-height: 42px;
	border-radius: 50%;
	background: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
	border: 1px solid ${neutralColors.gray[400]};
`;
