import styled from 'styled-components';
import { brandColors, Caption, neutralColors } from '@giveth/ui-design-system';

export const NetworkToast = styled.div`
	display: flex;
	gap: 10px;
	width: 100%;
	margin-bottom: 9px;
	color: ${neutralColors.gray[800]};
	> :last-child {
		flex-shrink: 0;
	}
	> div:first-child > svg {
		flex-shrink: 0;
	}
	img {
		padding-right: 12px;
	}
`;

export const SwitchCaption = styled(Caption)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin: 0 auto;
`;
