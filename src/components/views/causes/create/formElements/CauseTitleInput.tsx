import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { gqlCauseTitleValidation } from '@/components/views/causes/create/helpers';

export default function CauseTitleInput() {
	const router = useRouter();
	const locale = router.locale || 'en';

	const { formatMessage } = useIntl();
	const {
		register,
		formState: { errors: formErrors },
		watch,
	} = useFormContext();

	const [isTitleValidating, setIsTitleValidating] = useState(false);
	const titleValue = watch('title');

	const noTitleValidation = (i: string) => titleValue && titleValue === i;

	const validateTitleCharacter = (title: string): boolean => {
		const htmlTagRegex = /<\/?[a-z][\s\S]*?>/i;
		return !htmlTagRegex.test(title);
	};

	const titleValidation = async (title: string) => {
		if (noTitleValidation(title)) return true;
		if (!validateTitleCharacter(title))
			return formatMessage({
				id: 'label.cause.title_invalid',
			});
		setIsTitleValidating(true);
		const result = await gqlCauseTitleValidation(title, locale);
		setIsTitleValidating(false);
		return result;
	};

	return (
		<InputWrapper>
			<Input
				label={formatMessage({ id: 'label.cause.title' })}
				placeholder={formatMessage({
					id: 'label.cause.title_placeholder',
				})}
				value={titleValue}
				maxLength={100}
				autoFocus
				size={InputSize.LARGE}
				isValidating={isTitleValidating}
				register={register}
				registerName='title'
				registerOptions={{
					...requiredOptions.title,
					validate: titleValidation,
				}}
				error={formErrors.title}
			/>
		</InputWrapper>
	);
}

const InputWrapper = styled.div`
	margin-bottom: 24px;
`;
