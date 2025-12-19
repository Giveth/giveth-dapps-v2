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

const RichTextLexicalEditor = dynamic(
	() => import('@/components/rich-text-lexical/RichTextLexicalEditor'),
	{
		ssr: false,
		loading: () => <WrappedSpinner size={500} />,
	},
);

export const CAUSE_DESCRIPTION_MIN_LIMIT = 1200;

interface ICauseDescriptionInputProps {
	setActiveCauseSection: (section: ECreateCauseSections) => void;
	causeId?: number;
}

const CauseDescriptionInput = ({
	setActiveCauseSection,
	causeId,
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
							min: CAUSE_DESCRIPTION_MIN_LIMIT,
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
				title={formatMessage({ id: 'label.cause.ai_powered' })}
				message={formatMessage({ id: 'label.cause.please_note_desc' })}
			/>
			<InputContainer>
				<RichTextLexicalEditor
					initialValue={description}
					onChange={handleDescription}
					setHasLimitError={setHasLimitError}
					maxLength={CAUSE_DESCRIPTION_MIN_LIMIT}
					error={errors[EInputs.description]?.message}
					projectId={causeId ? causeId.toString() : undefined}
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
