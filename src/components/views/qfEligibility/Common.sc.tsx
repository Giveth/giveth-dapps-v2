import styled from 'styled-components';
import { neutralColors, Flex, P } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';
import { ContributeCardBox } from '@/components/ContributeCard.sc';

export const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-block: 90px;
`;

export const QFEligibilityBG = styled(Flex)<{ $background: string }>`
	border-radius: 16px;
	padding: 100px 8px;
	align-items: center;
	text-align: center;
	flex-direction: column;
	gap: 24px;
	background-color: ${neutralColors.gray[100]};
	width: 85%;
	max-width: 1076px;
	position: relative;
	overflow: hidden;
	box-shadow: 0 3px 20px ${Shadow.Neutral[400]};
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url(${props => props.$background});
		background-size: cover;
		background-position: center;
		filter: brightness(0.5);
	}
	${mediaQueries.laptopS} {
		min-height: 765px;
	}
`;

export const QFEligibilityBGInner = styled(ContributeCardBox)`
	display: flex;
	background-color: ${neutralColors.gray[100]};
	flex-direction: column;
	gap: 16px;
	z-index: 1;
	width: 50%;
	margin-block: auto;
`;

export const EligibilityTop = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

export const QFEligibilityStatus = styled.div<{
	$bgColor: string;
	$color: string;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	height: 40px;
	width: 135px;
	border-radius: 25px;
	background-color: ${props => props.$bgColor};
	color: ${props => props.$color};
`;

export const EligibilityCardDesc = styled(P)`
	width: 100%;
	max-width: 1000px;
	text-align: left;
	gap: 20px;
	button {
		margin: 20px 0 0 0;
		width: 100%;
	}
	background-color: ${neutralColors.gray[200]};
	padding: 16px;
	border-radius: 8px;
`;

export const QFEligibilityStateSection = styled(P)`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-block: 30px;
	gap: 16px;
`;

export const EligibilityCardBottom = styled.div<{ $justify?: string }>`
	display: flex;
	justify-content: ${props => props.$justify || 'space-between'};
	align-items: center;
	gap: 16px;
`;
