import React from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import { InputContainer, Label } from './Create.sc';
import styled from 'styled-components';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const NameInput = (props: any) => {
	const { setValue } = props;
	return (
		<>
			<H5>Tell us about your project...</H5>
			<div>
				<CaptionContainer>
					Aim for 200-500 words.{' '}
					<span>How to write a good project description.</span>
				</CaptionContainer>
			</div>
			<InputContainer>
				<Label>Project story</Label>
				<RichTextInput
					style={TextInputStyle}
					rows={12}
					autoFocus
					onChange={(newValue: any) => {
						setValue(newValue);
						// console.log({ setValue, newValue, delta, source })
					}}
				/>
			</InputContainer>
		</>
	);
};

const CaptionContainer = styled(Caption)`
	height: 18px;
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const TextInputStyle = {
	height: '250px',
	marginTop: '4px',
	fontFamily: 'body',
};

export default NameInput;
