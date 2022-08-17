import { StylesConfig } from 'react-select';
import {
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';

const selectCustomStyles: StylesConfig = {
	control: (styles, { isDisabled, selectProps }) => ({
		...styles,
		maxWidth: '520px',
		borderColor: selectProps.hasError
			? semanticColors.punch[500]
			: neutralColors.gray[300],
		borderWidth: '2px',
		borderRadius: '8px',
		boxShadow: 'none',
		padding: '8px',
		background: isDisabled ? `${neutralColors.gray[300]}` : 'initial',
		'&:hover': {
			borderColor: `${neutralColors.gray[300]}`,
			boxShadow: `${Shadow.Neutral[400]}`,
		},
		'&:focus-within': {
			borderColor: `${brandColors.giv[600]}`,
		},
	}),
	option: (styles, { isFocused, isSelected }) => ({
		padding: '8px',
		margin: '7px',
		fontWeight: 500,
		borderRadius: '4px',
		backgroundColor: isSelected
			? neutralColors.gray[300]
			: isFocused
			? neutralColors.gray[200]
			: 'white',
		color: isSelected ? neutralColors.gray[900] : neutralColors.gray[700],
	}),
	menu: styles => ({
		...styles,
		marginTop: 0,
		maxWidth: '520px',
		borderRadius: '8px',
		boxShadow: Shadow.Neutral[500],
	}),
	placeholder: styles => ({
		...styles,
		color: `${neutralColors.gray[500]}`,
	}),
};

export default selectCustomStyles;
