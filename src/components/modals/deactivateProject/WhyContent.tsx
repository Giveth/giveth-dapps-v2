import { GLink, Lead, neutralColors } from '@giveth/ui-design-system';
import Select, { StylesConfig } from 'react-select';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { ISelectObj } from './DeactivateProjectIndex';

interface IWhyContent {
	handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSelect: (e: any) => void;
	options: ISelectObj[];
	selectedOption: ISelectObj | void;
	textInput: string;
}

const WhyContent = ({
	handleChange,
	handleSelect,
	options,
	selectedOption,
	textInput,
}: IWhyContent) => (
	<>
		<Lead>Please let us know why you are deactivating this project!</Lead>
		<Select
			options={options}
			placeholder='Select a reason for deactivating'
			styles={selectCustomStyles}
			value={selectedOption}
			onChange={e => handleSelect(e)}
			isMobile={false}
		/>
		<AnimatePresence>
			{String(selectedOption?.value) === '5' && (
				<motion.div
					initial={{
						height: 0,
						opacity: 0,
					}}
					animate={{
						height: 'auto',
						opacity: 1,
					}}
					exit={{
						height: 0,
						opacity: 0,
					}}
					transition={{
						duration: 1,
					}}
				>
					<GLink>Or write your own reason:</GLink>
					<InputBox
						placeholder="I'm deactivating because..."
						rows={5}
						value={textInput}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
							handleChange(e)
						}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	</>
);

const selectCustomStyles: StylesConfig = {
	control: styles => ({
		...styles,
		border: 0,
		borderRadius: '8px',
		boxShadow: 'none',
		backgroundColor: neutralColors.gray[200],
		margin: '12px 0',
	}),
	dropdownIndicator: styles => ({
		...styles,
		color: neutralColors.gray[900],
	}),
	indicatorSeparator: styles => ({
		...styles,
		backgroundColor: neutralColors.gray[200],
	}),
	menu: styles => ({
		...styles,
		border: '0px',
		borderRadius: '8px',
		boxShadow: Shadow.Neutral[500],
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		width: '95%',
		height: '38px',
		margin: '4px auto',
		borderRadius: '8px',
		color: 'black',
		backgroundColor: isSelected
			? neutralColors.gray[300]
			: isFocused
			? neutralColors.gray[200]
			: neutralColors.gray[100],
	}),
	placeholder: styles => ({
		...styles,
		color: neutralColors.gray[900],
	}),
};

const InputBox = styled(motion.textarea)`
	display: block;
	width: 100%;
	resize: none;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	box-shadow: ${Shadow.Neutral[400]};
	font-family: 'Red Hat Text', sans-serif;
	font-size: 16px;
	padding: 8px;
	margin-top: 4px;

	::placeholder,
	::-webkit-input-placeholder {
		font-family: 'Red Hat Text', sans-serif;
		font-size: 16px;
		color: ${neutralColors.gray[400]};
		padding: 2px 8px;
	}
`;

export default WhyContent;
