import React, { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { EInputs } from '@/components/views/create/CreateProject';
import { gqlTitleValidation } from '@/components/views/create/helpers';
import useFocus from '@/hooks/useFocus';
import Routes from '@/lib/constants/Routes';

interface IProps {
	preTitle?: string;
	showGuidelineModal: boolean;
}

const NameInput: FC<IProps> = ({ preTitle, showGuidelineModal }) => {
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

	const isCreateMode = router.pathname.includes(Routes.CreateProject);

	const [inputRef, setFocus] = useFocus();
	const firstGuideModalClosed = useRef(false);
	const isFirstRender = useRef(true);

	useEffect(() => {
		// For handling a case when the user clicks on Submission guidelines and close it - We shouldn't focus in this case
		if (
			!showGuidelineModal &&
			isCreateMode &&
			!firstGuideModalClosed.current &&
			!isFirstRender.current
		) {
			setFocus();
			firstGuideModalClosed.current = true;
		}
		isFirstRender.current = false;
	}, [showGuidelineModal]);

	return (
		<>
			<Input
				label={formatMessage({ id: 'label.project_name' })}
				placeholder={formatMessage({ id: 'label.my_first_project' })}
				maxLength={55}
				autoFocus
				size={InputSize.LARGE}
				value={watchName}
				ref={inputRef}
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
