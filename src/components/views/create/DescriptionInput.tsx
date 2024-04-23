import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import { InputContainer, Label } from './Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';
import { WrappedSpinner } from '@/components/Spinner';
import { ECreateProjectSections, EInputs } from './types';

const RichTextInput = dynamic(
	() => import('@/components/rich-text/RichTextInput'),
	{
		ssr: false,
		loading: () => <WrappedSpinner size={500} />,
	},
);

const DESCRIPTION_MIN_LIMIT = 1200;

interface IDescriptionInputProps {
	setActiveProjectSection: (section: ECreateProjectSections) => void;
}

const DescriptionInput = ({
	setActiveProjectSection,
}: IDescriptionInputProps) => {
	const {
		getValues,
		setValue,
		formState: { errors },
		setError,
		clearErrors,
		getFieldState,
	} = useFormContext();
	const { formatMessage } = useIntl();

	const [showModal, setShowModal] = useState(false);
	const [description, setDescription] = useState(
		getValues(EInputs.description),
	);

	const handleDescription = (value: string) => {
		setDescription(value);
		setValue(EInputs.description, value);
	};

	const setHasLimitError = (hasLimitError: boolean) => {
		const oldError = getFieldState(EInputs.description)?.error;
		if (hasLimitError) {
			if (oldError) return;
			setError(
				EInputs.description,
				{
					type: 'focus',
					message: `Describe your project with at least ${DESCRIPTION_MIN_LIMIT} characters, tell us more!`,
				},
				{ shouldFocus: true },
			);
		} else {
			if (!oldError) return;
			clearErrors(EInputs.description);
		}
	};

	return (
		<div
			onMouseEnter={() =>
				setActiveProjectSection(ECreateProjectSections.description)
			}
		>
			{showModal && (
				<GoodProjectDescription
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<H5 id='project_description'>
				{formatMessage({ id: 'label.tell_us_about_your_project' })}
			</H5>
			<CaptionContainer>
				{formatMessage({ id: 'label.aim_for_200_500_words' })}{' '}
				<span onClick={() => setShowModal(true)}>
					{formatMessage({
						id: 'label.how_to_write_a_good_project_desc',
					})}
				</span>
			</CaptionContainer>
			<InputContainer>
				<Label>{formatMessage({ id: 'label.project_story' })}</Label>
				<RichTextInput
					style={TextInputStyle}
					setValue={handleDescription}
					value={description}
					noShadow
					minLimit={DESCRIPTION_MIN_LIMIT}
					setHasLimitError={setHasLimitError}
					error={errors[EInputs.description]?.message}
				/>
			</InputContainer>
		</div>
	);
};

const CaptionContainer = styled(Caption)`
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const TextInputStyle = {
	marginTop: '4px',
	fontFamily: 'body',
};

export default DescriptionInput;
