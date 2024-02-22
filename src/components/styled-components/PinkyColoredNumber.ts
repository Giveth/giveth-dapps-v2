import {
	ButtonText,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

export const PinkyColoredNumber = styled(ButtonText)`
	background-color: ${brandColors.pinky[500]};
	width: 18px;
	height: 18px;
	border-radius: 50%;
	color: ${neutralColors.gray[100]};
`;
