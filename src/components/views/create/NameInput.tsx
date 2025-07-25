import React, { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { gqlTitleValidation } from '@/components/views/create/helpers';
import useFocus from '@/hooks/useFocus';
import Routes from '@/lib/constants/Routes';
import { ECreateProjectSections, EInputs } from './types';

interface IProps {
	preTitle?: string;
	setActiveProjectSection: (section: ECreateProjectSections) => void;
}

const NameInput: FC<IProps> = ({ preTitle, setActiveProjectSection }) => {
	const router = useRouter();
	const locale = router.locale || 'en';

	const {
		register,
		formState: { errors: formErrors },
		watch,
	} = useFormContext();
	const { formatMessage } = useIntl();

	const [isTitleValidating, setIsTitleValidating] = useState(false);
	const titleValue = watch(EInputs.name);

	const noTitleValidation = (i: string) => preTitle && preTitle === i;

	const validateTitleCharacter = (title: string): boolean => {
		const htmlTagRegex = /<\/?[a-z][\s\S]*?>/i;
		return !htmlTagRegex.test(title);
	};

	const titleValidation = async (title: string) => {
		if (noTitleValidation(title)) return true;
		if (!validateTitleCharacter(title))
			return formatMessage({
				id: 'label.project_name_invalid',
			});
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
			isCreateMode &&
			!firstGuideModalClosed.current &&
			!isFirstRender.current
		) {
			setFocus();
			firstGuideModalClosed.current = true;
		}
		isFirstRender.current = false;
	}, []);

	return (
		<>
			<Input
				label={formatMessage({ id: 'label.project_name' })}
				placeholder={formatMessage({ id: 'label.my_first_project' })}
				maxLength={55}
				value={titleValue}
				autoFocus
				size={InputSize.LARGE}
				ref={inputRef}
				isValidating={isTitleValidating}
				register={register}
				registerName={EInputs.name}
				registerOptions={{
					...requiredOptions.title,
					validate: titleValidation,
				}}
				error={formErrors[EInputs.name]}
				onMouseEnter={() =>
					setActiveProjectSection(ECreateProjectSections.name)
				}
			/>
			<br />
		</>
	);
};

export default NameInput;
