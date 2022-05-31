import {
	H6,
	Lead,
	neutralColors,
	OulineButton,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState } from 'react';
import AddAddressModal from '@/components/views/verification/manageFunds/AddAddressModal';
import UserAddress from '@/components/views/verification/manageFunds/UserAddress';
import { TextArea } from '@/components/styled-components/TextArea';

export interface IAddress {
	walletAddress: string;
	title: string;
	network: string;
}

const ManageFundsIndex = () => {
	const [description, setDescription] = useState('');
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [addresses, setAddresses] = useState<IAddress[]>([]);

	const addAddress = (addressObj: IAddress) => {
		setAddresses([...addresses, addressObj]);
	};

	const removeAddress = (index: number) => {
		const newAddresses = [...addresses];
		newAddresses.splice(index, 1);
		setAddresses(newAddresses);
	};

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
				<PStyled>
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
				<OutlineStyled
					onClick={() => setShowAddressModal(true)}
					label='ADD ADDRESS'
					buttonType='primary'
				/>
				{addresses.map((address, index) => (
					<UserAddress
						remove={() => removeAddress(index)}
						address={address}
						key={address.title}
					/>
				))}
			</Lead>
			{showAddressModal && (
				<AddAddressModal
					addAddress={addAddress}
					setShowModal={setShowAddressModal}
				/>
			)}
		</>
	);
};

const OutlineStyled = styled(OulineButton)`
	padding-left: 100px;
	padding-right: 100px;
	margin-bottom: 24px;
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

const DescriptionInput = styled(TextArea)`
	margin-bottom: 62px;
	height: 180px;
`;

export default ManageFundsIndex;
