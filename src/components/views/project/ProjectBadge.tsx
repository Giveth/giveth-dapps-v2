import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { SublineBold, neutralColors } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IProjectBadgeProps {
	badgeText: string;
	wrapperColor?: string;
	textColor?: string;
	BadgeIcon?: ReactNode;
	borderColor?: string;
}

const ProjectBadge = ({
	badgeText,
	wrapperColor = neutralColors.gray[900],
	textColor = neutralColors.gray[100],
	BadgeIcon = null,
	borderColor = 'transparent',
}: IProjectBadgeProps) => {
	return (
		<BadgeWrapper
			gap='8px'
			wrapperColor={wrapperColor}
			textColor={textColor}
			borderColor={borderColor}
		>
			{BadgeIcon && BadgeIcon}
			<SublineBold>{badgeText}</SublineBold>
		</BadgeWrapper>
	);
};

const BadgeWrapper = styled(FlexCenter)<{
	wrapperColor: string;
	textColor: string;
	borderColor: string;
}>`
	height: 34px;
	background: ${props => props.wrapperColor};
	color: ${props => props.textColor};
	padding: 8px 16px;
	border-radius: 50px;
	border: 1px solid ${props => props.borderColor};
`;

export default ProjectBadge;
