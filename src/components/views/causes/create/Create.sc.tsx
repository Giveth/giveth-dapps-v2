import styled from 'styled-components';
import { neutralColors, GLink, brandColors } from '@giveth/ui-design-system';

export const InputContainer = styled.div`
	margin: 24px 0 64px 0;
	color: ${neutralColors.gray[900]};
`;

export const Label = styled(GLink)`
	height: 18px;
	margin: 4px 0 0 0;
`;

export const TinyLabel = styled(GLink)`
	margin: 4px 0 0 0;
	color: ${neutralColors.gray[900]};
`;

export const NextDescription = styled.div`
	margin-top: 36px;
	margin-bottom: 24px;

	h4 {
		margin-bottom: 24px;
		font-weight: 700;
		font-size: 32px;
		line-height: 56px;
		color: ${brandColors.deep[900]};
	}

	p {
		font-size: 16px;
		line-height: 24px;
		color: ${brandColors.deep[600]};
	}
`;

export const PreviousButtonContainer = styled.div`
	margin-right: 12px;
`;

export const ButtonContainer = styled.div`
	margin-top: 12px;
	display: flex;
	justify-content: flex-start;
	padding: 0;

	button {
		padding: 12px 8em;
	}

	span {
		text-transform: uppercase !important;
		font-size: 14px !important;
		line-height: 20px !important;
	}
`;

export const BackButton = styled.button`
	background-color: ${neutralColors.gray[200]};
	color: ${neutralColors.gray[600]};
	border: 2px solid ${neutralColors.gray[600]};
	border-radius: 48px;
	padding: 12px 8em;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background-color: ${neutralColors.gray[300]};
		color: ${neutralColors.gray[800]};
	}

	&:active {
		background-color: ${neutralColors.gray[400]};
	}
`;
