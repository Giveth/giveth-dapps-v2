import { useEffect, useState } from 'react';
import { IFormValidations, InputValidationType } from '@/components/Input';

const useFormValidation = (formValidation?: IFormValidations) => {
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		if (formValidation) {
			const fvs = Object.values(formValidation);
			setDisabled(!fvs.every(fv => fv === InputValidationType.NORMAL));
		}
	}, [formValidation]);

	return !disabled;
};

export default useFormValidation;
