import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
	brandColors,
	Lead,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import { useGeneral, ETheme } from '@/context/general.context';

import RadioOnIcon from '../../../../public/images/radio_on.svg';
import RadioOffIcon from '../../../../public/images/radio_off.svg';

const RadioTitle = (props: {
	title: string;
	subtitle?: string;
	isSelected: boolean;
	toggleRadio: () => void;
}) => {
	const { title, subtitle, isSelected, toggleRadio } = props;
	const { theme } = useGeneral();

	return (
		<RadioTitleBox onClick={toggleRadio}>
			<Image
				src={isSelected ? RadioOnIcon : RadioOffIcon}
				alt='radio icon'
			/>
			<div>
				<RadioTitleText
					isSelected={isSelected}
					isDark={theme === ETheme.Dark}
				>
					{title}
				</RadioTitleText>
				<RadioSubtitleText isSelected={isSelected}>
					{subtitle}
				</RadioSubtitleText>
			</div>
		</RadioTitleBox>
	);
};

const RadioTitleBox = styled.div`
	display: flex;
	cursor: pointer;
	margin-bottom: 10px;

	> :last-child {
		margin-left: 16px;
	}
`;

const RadioTitleText = styled(Lead)`
	color: ${(props: { isSelected: boolean; isDark: boolean }) =>
		props.isSelected
			? props.isDark
				? 'white'
				: brandColors.deep[900]
			: neutralColors.gray[600]};
`;

const RadioSubtitleText = styled(Subline)`
	color: ${(props: { isSelected: boolean }) =>
		props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`;

export default RadioTitle;
