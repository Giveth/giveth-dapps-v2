import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import { InputContainer, Label } from './Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';
import { EInputs } from '@/components/views/create/CreateProject';

const RichTextInput = dynamic(
	() => import('@/components/rich-text/RichTextInput'),
	{
		ssr: false,
	},
);

const DESCRIPTION_MIN_LIMIT = 1200;

const DescriptionInput = () => {
	const {
		getValues,
		setValue,
		formState: { errors },
		setError,
		clearErrors,
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
		if (hasLimitError) {
			setError(
				EInputs.description,
				{
					type: 'focus',
					message: `Describe your project with at least ${DESCRIPTION_MIN_LIMIT} characters, tell us more!`,
				},
				{ shouldFocus: true },
			);
		} else {
			clearErrors(EInputs.description);
		}
	};

	return (
		<>
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
		</>
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
