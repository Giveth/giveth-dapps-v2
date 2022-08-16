import React, { FC } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
	brandColors,
	Lead,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import RadioOnIcon from '/public/images/radio_on.svg';
import RadioOffIcon from '/public/images/radio_off.svg';

interface IProps {
	isSelected: boolean;
	title: string;
	subtitle?: string;
	toggleRadio: () => void;
}

const RadioButton: FC<IProps> = ({
	title,
	subtitle,
	isSelected,
	toggleRadio,
}) => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<Container onClick={toggleRadio}>
			<Image
				src={isSelected ? RadioOnIcon : RadioOffIcon}
				alt='radio icon'
			/>
			<div>
				<RadioTitle
					isSelected={isSelected}
					isDark={theme === ETheme.Dark}
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

const Container = styled.div`
	display: flex;
	cursor: pointer;
	margin-bottom: 10px;

	> :first-child {
		flex-shrink: 0;
	}
	> :last-child {
		margin-left: 16px;
	}
`;

const RadioTitle = styled(Lead)<{ isDark: boolean; isSelected: boolean }>`
	color: ${props =>
		props.isSelected
			? props.isDark
				? 'white'
				: brandColors.deep[900]
			: neutralColors.gray[600]};
`;

const RadioSubtitle = styled(Subline)<{ isSelected: boolean }>`
	color: ${props =>
		props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`;

export default RadioButton;
