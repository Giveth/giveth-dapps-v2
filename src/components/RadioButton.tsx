import React, { FC } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors, Subline } from '@giveth/ui-design-system';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';

interface IProps {
	isSelected: boolean;
	title: string;
	subtitle?: string;
	toggleRadio: () => void;
	small?: boolean;
}

const RadioButton: FC<IProps> = props => {
	const { title, subtitle, isSelected, toggleRadio, small } = props;
	const theme = useAppSelector(state => state.general.theme);

	return (
		<Container onClick={toggleRadio}>
			<RadioCircle isSmall={small} isSelected={isSelected}>
				{isSelected && <RadioSelected />}
			</RadioCircle>
			<div>
				<RadioTitle
					isSelected={isSelected}
					isDark={theme === ETheme.Dark}
					isSmall={small}
				>
					{title}
				</RadioTitle>
				<RadioSubtitle isSelected={isSelected}>
					{subtitle}
				</RadioSubtitle>
			</div>
		</Container>
	);
};

const RadioSelected = styled.div`
	background: ${brandColors.giv[500]};
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 3px solid white;
`;

const RadioCircle = styled.div<{ isSmall?: boolean; isSelected: boolean }>`
	width: ${props => (props.isSmall ? '20px' : '24px')};
	height: ${props => (props.isSmall ? '20px' : '24px')};
	border-radius: 50%;
	flex-shrink: 0;
	margin-right: ${props => (props.isSmall ? '6px' : '16px')};
	border: 2px solid
		${props =>
			props.isSelected
				? neutralColors.gray[900]
				: neutralColors.gray[700]};
	background: transparent;
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	margin-bottom: 10px;
`;

const RadioTitle = styled.div<{
	isDark: boolean;
	isSelected: boolean;
	isSmall?: boolean;
}>`
	font-size: ${props => (props.isSmall ? '16px' : '20px')};
	user-select: none;
	color: ${props =>
		props.isSelected
			? props.isDark
				? 'white'
				: brandColors.deep[900]
			: neutralColors.gray[600]};
`;

const RadioSubtitle = styled(Subline)<{ isSelected: boolean }>`
	user-select: none;
	color: ${props =>
		props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`;

export default RadioButton;
