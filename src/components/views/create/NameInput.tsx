import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { EInputs } from '@/components/views/create/CreateProject';
import { gqlTitleValidation } from '@/components/views/create/helpers';

interface IProps {
	preTitle?: string;
}

const NameInput: FC<IProps> = ({ preTitle }) => {
	const router = useRouter();
	const locale = router.locale || 'en';

	const {
		register,
		formState: { errors: formErrors },
		watch,
	} = useFormContext();
	const { formatMessage } = useIntl();

	const [isTitleValidating, setIsTitleValidating] = useState(false);

	const watchName = watch(EInputs.name);

	const noTitleValidation = (i: string) => preTitle && preTitle === i;

	const titleValidation = async (title: string) => {
		if (noTitleValidation(title)) return true;
		setIsTitleValidating(true);
		const result = await gqlTitleValidation(title, locale);
		setIsTitleValidating(false);
		return result;
	};

	return (
		<>
			<Input
				label={formatMessage({ id: 'label.project_name' })}
				placeholder={formatMessage({ id: 'label.my_first_project' })}
				maxLength={55}
				size={InputSize.LARGE}
				value={watchName}
				isValidating={isTitleValidating}
				register={register}
				registerName={EInputs.name}
				registerOptions={{
					...requiredOptions.name,
					validate: titleValidation,
				}}
				error={formErrors[EInputs.name]}
			/>
			<br />
		</>
	);
};

export default NameInput;
