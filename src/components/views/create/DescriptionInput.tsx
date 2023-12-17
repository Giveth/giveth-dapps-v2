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
	() => import('@/components/rich-text/QuillTextInput'),
	{
		ssr: false,
	},
);

const DESCRIPTION_LIMIT = 1200;

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

	const setIsLimitExceeded = (IsExceeded: boolean) => {
		IsExceeded
			? setError(
					EInputs.description,
					{
						type: 'focus',
						message: `Please enter less than ${DESCRIPTION_LIMIT} characters`,
					},
					{ shouldFocus: true },
			  )
			: clearErrors(EInputs.description);
	};

	return (
		<>
			{showModal && (
				<GoodProjectDescription
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<H5>{formatMessage({ id: 'label.tell_us_about_your_project' })}</H5>
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
					limit={DESCRIPTION_LIMIT}
					setIsLimitExceeded={setIsLimitExceeded}
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
