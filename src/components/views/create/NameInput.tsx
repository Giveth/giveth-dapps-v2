import React from 'react';
import { H5 } from '@giveth/ui-design-system';
import { InputContainer } from './Create.sc';
import { ECreateErrFields } from '@/components/views/create/CreateProject';
import InputBox from '@/components/InputBox';

const NameInput = (props: {
	value: string;
	setValue: (e: string) => void;
	error: string;
}) => {
	const { setValue, value, error } = props;
	const maxLength = 55;
	return (
		<>
			<H5 id={ECreateErrFields.NAME}>Name of your Project</H5>
			<InputContainer>
				<InputBox
					label='Project name'
					placeholder='My First Project'
					onChange={setValue}
					value={value}
					maxLength={maxLength}
					error={error}
				/>
			</InputContainer>
		</>
	);
};

export default NameInput;
