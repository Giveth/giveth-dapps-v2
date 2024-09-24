import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	Flex,
	FlexCenter,
	GLink,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { AmountInput } from '@/components/AmountInput/AmountInput';

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
	transition: color 0.5s ease;
	border-radius: 8px;
	border: 1px solid
		${props =>
			props.active
				? semanticColors.jade[400]
				: props.warning
					? semanticColors.golden[400]
					: neutralColors.gray[400]};
	padding: 4px 8px 4px 4px;
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

export const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;

export const GLinkStyled = styled(GLink)`
	&&:hover {
		cursor: pointer;
		text-decoration: underline;
	}
`;

export const Input = styled(AmountInput)<{ disabled?: boolean }>`
	background-color: ${props =>
		props.disabled ? neutralColors.gray[300] : 'white'};
	opacity: ${props => (props.disabled ? 0.4 : 1)};
	width: 100%;
	border-left: 2px solid ${neutralColors.gray[300]};
	border-radius: 0 8px 8px 0;
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%; /* 24px */
		width: 100%;
	}
`;

export const SelectTokenWrapper = styled(Flex)<{ disabled?: boolean }>`
	cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
	background-color: white;
	border-radius: 8px;
	gap: 16px;
`;

export const SelectTokenPlaceHolder = styled(B)`
	white-space: nowrap;
`;

export const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background-color: white;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
	position: relative;
`;

export const ForEstimatedMatchingAnimation = styled.div<{
	showEstimatedMatching?: boolean;
}>`
	transform: ${props =>
		props.showEstimatedMatching ? 'none' : 'translateY(-36px)'};
	transition: transform 0.5s ease;
`;
