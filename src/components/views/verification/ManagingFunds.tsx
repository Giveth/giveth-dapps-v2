import {
	H6,
	Lead,
	neutralColors,
	OulineButton,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState } from 'react';

const ManagingFunds = () => {
	const [description, setDescription] = useState('');
	return (
		<>
			<H6 weight={700}>Managing funds</H6>
			<Lead>
				<br />
				The funds raised are expected to be used for public benefit and
				not for personal gain. How will you use the funds that your
				project raises? Please provide detailed funding/budget
				information as well as an overall roadmap or action plan of the
				project.
				<PStyled color='red'>
					Note: It is acceptable for donations to be used for salaries
					and other internal expenses of the project. The idea is that
					the funds are being used to support the project and that the
					project, as a whole, is benefiting society.
				</PStyled>
				<DescriptionInput
					value={description}
					name='link'
					placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
				applications"'
					onChange={e => setDescription(e.target.value)}
				/>
				<div>Additional address</div>
				<AddressDescription>
					Please provide additional Ethereum wallet addresses used for
					managing funds within your project.
				</AddressDescription>
				<OutlineStyled label='ADD ADDRESS' buttonType='primary' />
			</Lead>
		</>
	);
};

const OutlineStyled = styled(OulineButton)`
	padding-left: 100px;
	padding-right: 100px;
`;

const AddressDescription = styled(P)`
	color: ${neutralColors.gray[800]};
	margin-bottom: 24px;
`;

const PStyled = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	margin-top: 8px;
`;

const DescriptionInput = styled.textarea`
	width: 100%;
	margin-bottom: 62px;
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
		border-color: ${neutralColors.gray[500]};
	}
`;

export default ManagingFunds;
