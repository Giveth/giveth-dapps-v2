import { Button, H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, useState } from 'react';
import Select from 'react-select';
import RadioButton from '../../RadioButton';
import Input from '@/components/Input';
import { Label } from '../create/Create.sc';
import { TextArea } from '@/components/styled-components/TextArea';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { BtnContainer, ContentSeparator } from './VerificationIndex';

const options = [
	{ value: 'new york', label: 'New York' },
	{ value: 'chicago', label: 'Chicago' },
	{ value: 'san francisco', label: 'San Francisco' },
];

enum ProjectRegistryStates {
	NOTSELECTED = 'notselected',
	YES = 'yes',
	NO = 'no',
}

export default function ProjectRegistry() {
	const [isNonProfit, setIsNonProfit] = useState<ProjectRegistryStates>(
		ProjectRegistryStates.NOTSELECTED,
	);

	return (
		<>
			<div>
				<H6 weight={700}>Project registry</H6>
				<br />
				<RadioSectionContainer>
					<RadioSectionTitle>
						Is your project part of a registered non-profit
						organization?
					</RadioSectionTitle>
					<RadioSectionSubTitle>
						Having obtained non-profit status is not a requirement
						but it is helpful for the verification process
					</RadioSectionSubTitle>
					<br />
					<RadioContainer>
						<RadioButton
							title='Yes'
							toggleRadio={() =>
								setIsNonProfit(ProjectRegistryStates.YES)
							}
							isSelected={
								isNonProfit === ProjectRegistryStates.YES
							}
						/>
						<RadioButton
							title='No'
							toggleRadio={() =>
								setIsNonProfit(ProjectRegistryStates.NO)
							}
							isSelected={
								isNonProfit === ProjectRegistryStates.NO
							}
						/>
					</RadioContainer>
				</RadioSectionContainer>
				<br />

				{isNonProfit === ProjectRegistryStates.YES && (
					<ProjectRegistryNonProfit />
				)}

				{isNonProfit === ProjectRegistryStates.NO && (
					<ProjectRegistryProfit />
				)}
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button label='<     PREVIOUS' />
					<Button label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
}

function ProjectRegistryNonProfit() {
	const [link, setLink] = useState('');
	return (
		<>
			<Lead>In which country are you registered?</Lead>
			<br />
			<Select options={options} styles={selectCustomStyles} />
			<br />
			<Lead>
				Please provide a link to your country's government registry
				where the team can look up and confirm your status.
			</Lead>
			<br />
			<LinkInputContainer>
				<Label>Please enter full link</Label>
				<Input
					value={link}
					name='link'
					placeholder='https://'
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setLink(e.target.value);
					}}
				/>
			</LinkInputContainer>
		</>
	);
}

function ProjectRegistryProfit() {
	const [description, setDescription] = useState('');
	return (
		<>
			<Lead>
				Okay, it sounds like your project is not a registered
				non-profit. Please tell us a bit about how your organization is
				structured.
			</Lead>
			<br />
			<TextArea
				value={description}
				name='link'
				placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
				applications"'
				onChange={e => setDescription(e.target.value)}
			/>
		</>
	);
}

const RadioSectionContainer = styled.div`
	width: 100%;
	background-color: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 16px 24px;
`;
const RadioSectionTitle = styled(Lead)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
`;

const RadioSectionSubTitle = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const RadioContainer = styled.div`
	display: flex;
	gap: 160px;
`;

const LinkInputContainer = styled.div`
	width: 70%;
	max-width: 520px;
`;
