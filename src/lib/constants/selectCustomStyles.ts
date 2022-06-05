import { StylesConfig } from 'react-select';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';

const selectCustomStyles: StylesConfig = {
	control: styles => ({
		...styles,
		width: '70%',
		maxWidth: '520px',
		borderColor: neutralColors.gray[300],
		borderWidth: '2px',
		borderRadius: '8px',
		boxShadow: 'none',
		padding: '8px',
		'&:hover': {
			borderColor: `${neutralColors.gray[300]}`,
			boxShadow: `${Shadow.Neutral[400]}`,
		},
		'&:focus-within': {
			borderColor: `${brandColors.giv[500]}`,
		},
	}),
	option: (styles, { isFocused, isSelected }) => ({
		padding: '8px',
		borderRadius: '4px',
		backgroundColor: isSelected
			? neutralColors.gray[300]
			: isFocused
			? neutralColors.gray[200]
			: 'white',
		color: isSelected ? neutralColors.gray[900] : neutralColors.gray[800],
		'&:click': {
			backgroundColor: neutralColors.gray[300],
		},
	}),
	menu: styles => ({
		...styles,
		width: '70%',
		maxWidth: '520px',
		border: '0px',
		borderRadius: '8px',
		boxShadow: Shadow.Neutral[500],
		'&:focus-within': {
			border: `2px solid ${neutralColors.gray[300]}`,
		},
	}),
};

export default selectCustomStyles;
