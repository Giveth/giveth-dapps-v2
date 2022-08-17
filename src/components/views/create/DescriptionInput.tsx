import React, { useState } from 'react';
import {
	H5,
	Caption,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import { InputContainer, Label } from './Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const DescriptionInput = (props: {
	setValue: (e: string) => void;
	// error: string;
	value?: string;
}) => {
	const [showModal, setShowModal] = useState(false);
	const { value, setValue } = props;
	return (
		<>
			{showModal && (
				<GoodProjectDescription
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<H5>Tell us about your project...</H5>
			<CaptionContainer>
				Aim for 200-500 words.{' '}
				<span onClick={() => setShowModal(true)}>
					How to write a good project description.
				</span>
			</CaptionContainer>
			<InputContainerStyled>
				<Label>Project story</Label>
				<RichTextInput
					style={TextInputStyle}
					setValue={setValue}
					value={value}
				/>
			</InputContainerStyled>
			{/*<ErrorStyled>{error || null}</ErrorStyled>*/}
		</>
	);
};

const InputContainerStyled = styled(InputContainer)<{ error?: string }>`
	.ql-container.ql-snow,
	.ql-toolbar.ql-snow {
		border: ${props =>
			props.error && `2px solid ${semanticColors.punch[500]}`};
	}

	&:focus-within {
		.ql-toolbar.ql-snow,
		.ql-container.ql-snow {
			border: ${props =>
				!props.error && `2px solid ${brandColors.giv[600]}`};
		}
	}
`;

const ErrorStyled = styled.div`
	margin-top: -10px;
	margin-bottom: 20px;
	color: ${semanticColors.punch[500]};
	font-size: 12px;
	word-break: break-word;
`;

const CaptionContainer = styled(Caption)`
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const TextInputStyle = {
	marginTop: '4px',
	fontFamily: 'body',
};

export default DescriptionInput;
