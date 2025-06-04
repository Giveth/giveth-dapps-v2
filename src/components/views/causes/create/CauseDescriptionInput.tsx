import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Caption, brandColors } from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { InputContainer, Label } from '@/components/views/create/Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';
import { WrappedSpinner } from '@/components/Spinner';
import {
	ECreateCauseSections,
	EInputs,
} from '@/components/views/causes/create/types';

const RichTextInput = dynamic(
	() => import('@/components/rich-text/RichTextInput'),
	{
		ssr: false,
		loading: () => <WrappedSpinner size={500} />,
	},
);

const DESCRIPTION_MIN_LIMIT = 2000;

interface ICauseDescriptionInputProps {
	setActiveCauseSection: (section: ECreateCauseSections) => void;
}

const CauseDescriptionInput = ({
	setActiveCauseSection,
}: ICauseDescriptionInputProps) => {
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
					message: formatMessage(
						{ id: 'label.cause.create_description_desc' },
						{
							min: DESCRIPTION_MIN_LIMIT,
						},
					),
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
				setActiveCauseSection(ECreateCauseSections.description)
			}
		>
			{showModal && (
				<GoodProjectDescription
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<Label id='cause_description'>
				{formatMessage({ id: 'label.cause.create_description' })}
			</Label>
			<CaptionContainer>
				{formatMessage(
					{ id: 'label.provide_minimum_characters' },
					{
						min: DESCRIPTION_MIN_LIMIT,
					},
				)}{' '}
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

export default CauseDescriptionInput;
