import {
	brandColors,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';

export enum EBadgeStatus {
	DEFAULT,
	WARNING,
	ERROR,
	SUCCESS,
	GIVETH,
}

interface IBadge {
	label: string;
	status: EBadgeStatus;
	showBullet?: boolean;
	className?: string;
}

const badgeStatusToColor = (status: EBadgeStatus) => {
	switch (status) {
		case EBadgeStatus.DEFAULT:
			return neutralColors.gray;
		case EBadgeStatus.WARNING:
			return semanticColors.golden;
		case EBadgeStatus.ERROR:
			return semanticColors.punch;
		case EBadgeStatus.SUCCESS:
			return semanticColors.jade;
		case EBadgeStatus.GIVETH:
			return brandColors.giv;
		default:
			return neutralColors.gray;
	}
};

export const Badge: FC<IBadge> = ({ label, status, showBullet, className }) => {
	return (
		<BadgeContainer
			className={className}
			mainColor={badgeStatusToColor(status)}
		>
			{showBullet && <BulletPoint>&bull;</BulletPoint>}
			<SublineBold>{label}</SublineBold>
		</BadgeContainer>
	);
};

interface IBadgeContainer {
	mainColor: any;
}

export const BadgeContainer = styled.span<IBadgeContainer>`
	display: flex;
	align-items: center;
	color: ${props => props.mainColor[700]} !important;
	background: ${props => props.mainColor[100]};
	border: 2px solid ${props => props.mainColor[300]};
	border-radius: 50px;
	padding: 2px 8px;
	height: 24px;
`;

const BulletPoint = styled.div`
	font-size: 18px;
	margin-right: 4px;
	padding: 0;
`;
