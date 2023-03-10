import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
	H5,
	Caption,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import { InputContainer, Label } from './Create.sc';
import { GoodProjectDescription } from '@/components/modals/GoodProjectDescription';
import { EInputs } from '@/components/views/create/CreateProject';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const DescriptionInput = () => {
	const { getValues, setValue } = useFormContext();
	const { formatMessage } = useIntl();

	const [showModal, setShowModal] = useState(false);
	const [description, setDescription] = useState(
		getValues(EInputs.description),
	);

	const handleDescription = (value: string) => {
		setDescription(value);
		setValue(EInputs.description, value);
	};

	return (
		<>
			{showModal && (
				<GoodProjectDescription
					setShowModal={val => setShowModal(val)}
				/>
			)}

			<H5>{formatMessage({ id: 'label.tell_us_about_your_project' })}</H5>
			<CaptionContainer>
				{formatMessage({ id: 'label.aim_for_200_500_words' })}{' '}
				<span onClick={() => setShowModal(true)}>
					{formatMessage({
						id: 'label.how_to_write_a_good_project_desc',
					})}
				</span>
			</CaptionContainer>
			<InputContainerStyled>
				<Label>{formatMessage({ id: 'label.project_story' })}</Label>
				<RichTextInput
					style={TextInputStyle}
					setValue={handleDescription}
					value={description}
					noShadow
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
