import {
	brandColors,
	H6,
	Lead,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import RadioTitle from '../donate/RadioTitle';
import Input from '@/components/Input';
import { Label } from '../create/Create.sc';
import { Shadow } from '@/components/styled-components/Shadow';

const options = [
	{ value: 'new york', label: 'New York' },
	{ value: 'chicago', label: 'Chicago' },
	{ value: 'san francisco', label: 'San Francisco' },
];

export default function ProjectRegistry() {
	const [isNonProfit, setIsNonProfit] = useState(true);

	return (
		<>
			<H6 weight={700}>Project registry</H6>
			<br />
			<RadioSectionContainer>
				<RadioSectionTitle>
					Is your project part of a registered non-profit
					organization?
				</RadioSectionTitle>
				<RadioSectionSubTitle>
					Having obtained non-profit status is not a requirement but
					it is helpful for the verification process
				</RadioSectionSubTitle>
				<br />
				<RadioContainer>
					<RadioTitle
						title='Yes'
						toggleRadio={() => setIsNonProfit(true)}
						isSelected={isNonProfit}
					/>
					<RadioTitle
						title='No'
						toggleRadio={() => setIsNonProfit(false)}
						isSelected={!isNonProfit}
					/>
				</RadioContainer>
			</RadioSectionContainer>
			<br />
			{isNonProfit ? (
				<ProjectRegistryNonProfit />
			) : (
				<ProjectRegistryProfit />
			)}
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
			<DescriptionInput
				value={description}
				name='link'
				placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
				applications"'
				onChange={e => {
					console.log(e.target.value);
					setDescription(e.target.value);
				}}
			/>
		</>
	);
}

const selectCustomStyles: StylesConfig = {
	control: styles => ({
		...styles,
		width: '70%',
		maxWidth: '520px',
		borderColor: neutralColors.gray[300],
		borderWidth: '2px',
		borderRadius: '8px',
		boxShadow: 'none',
		padding: '8px',
		'&:hover': {
			borderColor: `${neutralColors.gray[500]}`,
		},
		'&:focus-within': {
			borderColor: `${brandColors.giv[500]}`,
		},
	}),
	option: (styles, { isFocused, isSelected }) => ({
		padding: '8px',
		borderRadius: '4px',
		backgroundColor: isSelected
			? neutralColors.gray[300]
			: isFocused
			? neutralColors.gray[200]
			: 'white',
		color: isSelected ? neutralColors.gray[900] : neutralColors.gray[800],
		'&:click': {
			backgroundColor: neutralColors.gray[300],
		},
	}),
	menu: styles => ({
		...styles,
		width: '70%',
		maxWidth: '520px',
		border: '0px',
		borderRadius: '8px',
		boxShadow: Shadow.Neutral[500],
		'&:focus-within': {
			border: `2px solid ${neutralColors.gray[300]}`,
		},
	}),
};

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
	max-width: '520px';
`;

const DescriptionInput = styled.textarea`
	width: 100%;
	border-radius: 8px;
	font-family: 'Red Hat Text', sans-serif;
	font-size: 1rem;
	border: 2px solid ${neutralColors.gray[300]};
	padding: 16px;
	height: 274px;
	resize: none;
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
	:hover {
		border-color: ${neutralColors.gray[500]};
	}
	:focus-within {
		border-color: ${brandColors.giv[500]};
	}
`;
