import React, { useState } from 'react';
import { H5, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Regular_Input } from '@/components/styled-components/Input';
import { InputContainer, Label } from './Create.sc';
import { FlexCenter } from '@/components/styled-components/Grid';

const NameInput = (props: { value: string; setValue: (e: string) => void }) => {
	const { setValue, value } = props;
	const [characterLength, setCharacterLength] = useState(0);
	const maxLength = 55;
	return (
		<>
			<H5>Name of your Project</H5>
			<InputContainer>
				<Label>Project name</Label>
				<div style={{ position: 'relative' }}>
					<Input
						placeholder='My First Project'
						onChange={e => {
							setValue(e.target.value);
							setCharacterLength(e.target.value.length);
						}}
						value={value}
						maxLength={maxLength}
					/>
					<CharLength>
						{characterLength}/{maxLength}
					</CharLength>
				</div>
			</InputContainer>
		</>
	);
};

const CharLength = styled(FlexCenter)`
	font-size: 12px;
	background: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	font-weight: 500;
	border-radius: 64px;
	width: 52px;
	height: 30px;
	position: absolute;
	right: 16px;
	top: 0;
	bottom: 0;
	margin: auto 0;
`;

const Input = styled(Regular_Input)``;

export default NameInput;
