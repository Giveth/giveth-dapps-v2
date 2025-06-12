import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';

export default function CauseTitleInput() {
	const { formatMessage } = useIntl();
	const {
		register,
		formState: { errors: formErrors },
	} = useFormContext();

	return (
		<InputWrapper>
			<Input
				label={formatMessage({ id: 'label.cause.title' })}
				placeholder={formatMessage({
					id: 'label.cause.title_placeholder',
				})}
				maxLength={100}
				autoFocus
				size={InputSize.LARGE}
				register={register}
				registerName='title'
				registerOptions={requiredOptions.title}
				error={formErrors.title}
			/>
		</InputWrapper>
	);
}

const InputWrapper = styled.div`
	margin-bottom: 24px;
`;
