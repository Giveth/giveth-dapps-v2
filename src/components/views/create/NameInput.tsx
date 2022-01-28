import React from 'react';
import { H5 } from '@giveth/ui-design-system';
import { Regular_Input } from '@/components/styled-components/Input';
import { InputContainer, Label } from './Create.sc';
import styled from 'styled-components';

const NameInput = (props: any) => {
	return (
		<>
			<H5>Name of your Project</H5>
			<InputContainer>
				<Label>Project name</Label>
				<Input placeholder='My First Project' />
			</InputContainer>
		</>
	);
};

const Input = styled(Regular_Input)``;

export default NameInput;
