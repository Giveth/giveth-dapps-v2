import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
import { useFormContext } from 'react-hook-form';
import { InputContainer, Label } from '@/components/views/create/Create.sc';
import { WrappedSpinner } from '@/components/Spinner';
import {
	ECreateCauseSections,
	EInputs,
} from '@/components/views/causes/create/types';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

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

	const [description, setDescription] = useState(
		getValues(EInputs.description) || '',
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
			<Label id='cause_description'>
				{formatMessage({ id: 'label.cause.create_description' })}
			</Label>
			<InlineToast
				type={EToastType.Info}
				title='Please note'
				message='Your input here will be used by the AI donation agent to evaluate and distribute funds to projects. Be specific about the impact you want to achieve.'
			/>
			<InputContainer>
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

const TextInputStyle = {
	marginTop: '4px',
	fontFamily: 'body',
};

export default CauseDescriptionInput;
