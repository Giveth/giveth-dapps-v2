import { GLink, Lead, neutralColors } from '@giveth/ui-design-system';
import Select from 'react-select';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Shadow } from '@/components/styled-components/Shadow';
import { ISelectObj } from './DeactivateProjectIndex';
import type { CSSObjectWithLabel, StylesConfig } from 'react-select';

interface IWhyContent {
	handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSelect: (e: any) => void;
	options: ISelectObj[];
	selectedOption: ISelectObj | void;
	textInput: string;
	isCause: boolean;
}

const WhyContent = ({
	handleChange,
	handleSelect,
	options,
	selectedOption,
	textInput,
	isCause,
}: IWhyContent) => {
	const { formatMessage } = useIntl();
	return (
		<>
			<Lead>
				{formatMessage({
					id: isCause
						? 'label.cause.deactivate_cause_modal.why_description'
						: 'label.project.deactivate_project_modal.why_description',
				})}
			</Lead>
			<Select
				options={options}
				placeholder={formatMessage({
					id: isCause
						? 'label.cause.deactivate_cause_modal.select_reason'
						: 'label.project.deactivate_project_modal.select_reason',
				})}
				styles={selectCustomStyles}
				value={selectedOption}
				onChange={e => handleSelect(e)}
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
							onChange={(
								e: React.ChangeEvent<HTMLTextAreaElement>,
							) => handleChange(e)}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

const selectCustomStyles: StylesConfig = {
	control: (baseStyles, props) =>
		({
			...baseStyles,
			border: 0,
			borderRadius: '8px',
			boxShadow: 'none',
			backgroundColor: neutralColors.gray[200],
			margin: '12px 0',
		}) as CSSObjectWithLabel,
	dropdownIndicator: (baseStyles, props) =>
		({
			...baseStyles,
			color: neutralColors.gray[900],
		}) as CSSObjectWithLabel,
	indicatorSeparator: (baseStyles, props) =>
		({
			...baseStyles,
			backgroundColor: neutralColors.gray[200],
		}) as CSSObjectWithLabel,
	menu: (baseStyles, props) =>
		({
			...baseStyles,
			border: '0px',
			borderRadius: '8px',
			boxShadow: Shadow.Neutral[500],
		}) as CSSObjectWithLabel,
	option: (baseStyles, { isFocused, isSelected }) =>
		({
			...baseStyles,
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
		}) as CSSObjectWithLabel,
	placeholder: (baseStyles, props) =>
		({
			...baseStyles,
			color: neutralColors.gray[900],
		}) as CSSObjectWithLabel,
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
