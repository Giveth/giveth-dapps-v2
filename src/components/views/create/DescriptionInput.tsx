import React, { useState } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { InputContainer, Label } from './Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const DescriptionInput = (props: { setValue: (e: string) => void }) => {
	const [showModal, setShowModal] = useState(false);
	const { setValue } = props;
	return (
		<>
			{showModal && (
				<GoodProjectDescription
					showModal={showModal}
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<H5>Tell us about your project...</H5>
			<div>
				<CaptionContainer>
					Aim for 200-500 words.{' '}
					<span onClick={() => setShowModal(true)}>
						How to write a good project description.
					</span>
				</CaptionContainer>
			</div>
			<InputContainer>
				<Label>Project story</Label>
				<RichTextInput
					style={TextInputStyle}
					rows={12}
					autoFocus
					onChange={setValue}
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

export default DescriptionInput;
