import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const TipListItem = styled.div`
	padding-left: 30px; // Include the space for the custom bullet
	font-size: 18px;
	line-height: 1.5;
	position: relative;
	margin-bottom: 10px; // Space between items
	box-sizing: border-box; // Includes padding in the width calculation
	word-wrap: break-word; // Ensures text wraps and doesn't overflow

	&::before {
		content: '';
		position: absolute;
		left: 10px;
		top: 12px;
		height: 5px;
		width: 5px;
		max-width: 100%;
		background-color: ${brandColors.giv[500]};
		border-radius: 50%;
		box-shadow: 0 0 0 3px ${brandColors.giv[100]};
	}
`;

export const TipLine = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${neutralColors.gray[400]};
	margin: 16px 0;
`;
