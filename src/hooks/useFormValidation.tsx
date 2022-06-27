import { useEffect, useState } from 'react';
import { IFormValidations } from '@/components/Input';
import { EInputValidation } from '@/types/inputValidation';

const useFormValidation = (formValidation?: IFormValidations) => {
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		if (formValidation) {
			const fvs = Object.values(formValidation);
			setDisabled(!fvs.every(fv => fv === EInputValidation.NORMAL));
		}
	}, [formValidation]);

	return !disabled;
};

export default useFormValidation;
