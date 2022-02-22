import { Row } from '@/components/styled-components/Grid';
import {
	brandColors,
	GLink,
	H6,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import styled from 'styled-components';
import { OnboardActions, OnboardStep } from './common';

const InfoStep = () => {
	const [disabled, setDisabled] = useState(true);
	const onSave = () => {};

	return (
		<OnboardStep>
			<SectionHeader>How we should call you?</SectionHeader>
			<Section>
				<InputContainer>
					<InputLabel>FIRST NAME</InputLabel>
					<Input placeholder='John' />
				</InputContainer>
				<InputContainer>
					<InputLabel>LAST NAME</InputLabel>
					<Input placeholder='Doe' />
				</InputContainer>
			</Section>
			<SectionHeader>Where are you?</SectionHeader>
			<Section>
				<InputContainer>
					<InputLabel>LOCATION (OPTIONAL)</InputLabel>
					<Input placeholder='Portugal, Turkey,...' />
				</InputContainer>
			</Section>
			<SectionHeader>
				Personal website or URL to somewhere special?
			</SectionHeader>
			<Section>
				<InputContainer>
					<InputLabel>WEBSITE OR URL (OPTIONAL)</InputLabel>
					<Input placeholder='Website' />
					<InputDesc size='Small'>
						Your home page, blog, or company site.
					</InputDesc>
				</InputContainer>
			</Section>
			<OnboardActions
				onSave={onSave}
				saveLabel='SAVE & CONTINUE'
				disabled={disabled}
			/>
		</OnboardStep>
	);
};

const Section = styled(Row)`
	padding-top: 32px;
	padding-bottom: 67px;
	gap: 24px;
`;

const SectionHeader = styled(H6)`
	padding-bottom: 16px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(Subline)`
	padding-bottom: 4px;
	color: ${brandColors.deep[500]};
`;

const Input = styled.input`
	width: 100%;
	height: 56px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 15px 16px;
	font-size: 16px;
	line-height: 150%;
	font-weight: 500;
	font-family: 'Red Hat Text';
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
`;

export default InfoStep;
