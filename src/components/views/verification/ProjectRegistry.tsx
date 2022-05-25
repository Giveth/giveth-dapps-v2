import { H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import RadioTitle from '../donate/RadioTitle';
import Input from '@/components/Input';
import { Label } from '../create/Create.sc';

const options = [
	{ value: 'new york', label: 'New York' },
	{ value: 'chicago', label: 'Chicago' },
	{ value: 'san francisco', label: 'San Francisco' },
];

const selectCustomStyles: StylesConfig = {
	control: styles => ({
		...styles,
		borderColor: neutralColors.gray[300],
		borderWidth: '2px',
		borderRadius: '8px',
		boxShadow: 'none',
		padding: '8px',
		width: '70%',

		maxWidth: '520px',
	}),
};

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
			<ProjectRegistryNonProfit />
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
			<Label>Please enter full link</Label>
			<Input
				value={link}
				name='link'
				placeholder='https://'
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setLink(e.target.value);
				}}
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
