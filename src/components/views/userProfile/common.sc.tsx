import { H5, P, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';

export const UserProfileTab = styled.div`
	margin-bottom: 80px;
`;

export const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
	margin-top: 40px;
`;

export const PassportSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	border: 1px solid ${neutralColors.gray[300]};
	padding: 16px;
	border-radius: 8px;
`;

export const StyledNote = styled(P)`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const QFMinScore = styled(P)`
	color: ${neutralColors.gray[900]};
	margin-left: 10px;
	font-weight: 700;
`;

export const ScoreCard = styled(P)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid ${neutralColors.gray[200]};
	padding: 16px;
	background-color: ${neutralColors.gray[200]};
	border-radius: 8px;
`;

export const ScoreBox = styled(P)`
	color: ${neutralColors.gray[100]};
	background-color: black;
	padding: 8px 16px;
	border-radius: 25px;
`;

export const Hr = styled.div`
	height: 1px;
	background-color: ${neutralColors.gray[300]};
	width: 100%;
`;

const BaseButton = styled.button`
	padding: 16px 32px;
	background-color: ${neutralColors.gray[100]};
	border: none;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	transition: color 0.2s ease-in-out;
	cursor: pointer;
`;

export const RefreshButton = styled(BaseButton)`
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;
