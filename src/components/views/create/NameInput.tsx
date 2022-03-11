import React, { useState } from 'react';
import { H5, neutralColors, SublineBold } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	InputContainer,
	InputErrorMessage,
	InputWithError,
	Label,
} from './Create.sc';
import { ECreateErrFields } from '@/components/views/create/CreateProject';

const NameInput = (props: {
	value: string;
	setValue: (e: string) => void;
	error: string;
}) => {
	const { setValue, value, error } = props;
	const [characterLength, setCharacterLength] = useState(0);
	const maxLength = 55;
	return (
		<>
			<H5 id={ECreateErrFields.NAME}>Name of your Project</H5>
			<InputContainer>
				<Label>Project name</Label>
				<RelativePositioned>
					<InputWithError
						placeholder='My First Project'
						onChange={e => {
							setValue(e.target.value);
							setCharacterLength(e.target.value.length);
						}}
						value={value}
						maxLength={maxLength}
						error={!!error}
					/>
					<CharLength>
						{characterLength}/{maxLength}
					</CharLength>
				</RelativePositioned>
				<InputErrorMessage>{error || null}</InputErrorMessage>
			</InputContainer>
		</>
	);
};

const RelativePositioned = styled.div`
	position: relative;
`;

const CharLength = styled(SublineBold)`
	display: flex;
	justify-content: center;
	align-items: center;
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

export default NameInput;
