import React, { useState } from 'react';
import {
	H5,
	Caption,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import { InputContainer, InputErrorMessage, Label } from './Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';
import { ECreateErrFields } from '@/components/views/create/CreateProject';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const DescriptionInput = (props: {
	setValue: (e: string) => void;
	error: string;
	value: string;
}) => {
	const [showModal, setShowModal] = useState(false);
	const { value, setValue, error } = props;
	return (
		<>
			{showModal && (
				<GoodProjectDescription
					showModal={showModal}
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<H5 id={ECreateErrFields.DESCRIPTION}>
				Tell us about your project...
			</H5>
			<div>
				<CaptionContainer>
					Aim for 200-500 words.{' '}
					<span onClick={() => setShowModal(true)}>
						How to write a good project description.
					</span>
				</CaptionContainer>
			</div>
			<InputContainerStyled error={error}>
				<Label>Project story</Label>
				<RichTextInput
					style={TextInputStyle}
					setValue={setValue}
					value={value}
				/>
			</InputContainerStyled>
			<ErrorStyled>{error || null}</ErrorStyled>
		</>
	);
};

const InputContainerStyled = styled(InputContainer)<{ error: string }>`
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

const ErrorStyled = styled(InputErrorMessage)`
	margin-top: -10px;
	margin-bottom: 20px;
`;

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

export default DescriptionInput;
