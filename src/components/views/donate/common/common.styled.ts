import styled from 'styled-components';
import {
	brandColors,
	Caption,
	neutralColors,
	Flex,
	FlexCenter,
	semanticColors,
	mediaQueries,
} from '@giveth/ui-design-system';

export const NetworkToast = styled(Flex)`
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

export const BadgesBase = styled(FlexCenter)<{
	active?: boolean;
	warning?: boolean;
}>`
	gap: 8px;
	font-size: 12px;
	font-weight: 500;
	background: ${neutralColors.gray[200]};
	color: ${props =>
		props.active ? semanticColors.jade[500] : neutralColors.gray[700]};
	border-radius: 8px;
	border: 1px solid
		${props =>
			props.active
				? semanticColors.jade[400]
				: props.warning
					? semanticColors.golden[400]
					: neutralColors.gray[400]};
	padding: 4px;
`;

export const EligibilityBadgeWrapper = styled(Flex)`
	gap: 16px;
	justify-content: center;
	flex-direction: column;
	> div {
		height: 36px;
	}
	${mediaQueries.tablet} {
		flex-direction: row;
		justify-content: flex-start;
	}
`;
