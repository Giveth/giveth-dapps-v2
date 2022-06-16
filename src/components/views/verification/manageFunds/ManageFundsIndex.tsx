import {
	Button,
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
import { ContentSeparator, BtnContainer } from '../VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import {
	PROJECT_VERIFICATION_STEPS,
	RelatedAddress,
} from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { showToastError } from '@/lib/helpers';

// export interface IAddress {
// 	address: string;
// 	title: string;
// 	networkId: string;
// }

const ManageFundsIndex = () => {
	const [loading, setLoading] = useState(false);
	const [showAddressModal, setShowAddressModal] = useState(false);
	const { setStep, setVerificationData, verificationData, step } =
		useVerificationData();
	console.log('verificationData', verificationData);
	const [addresses, setAddresses] = useState<RelatedAddress[]>(
		verificationData?.managingFunds?.relatedAddresses || [],
	);
	const [description, setDescription] = useState(
		verificationData?.managingFunds?.description || '',
	);

	const addAddress = (addressObj: RelatedAddress) => {
		setAddresses([...addresses, addressObj]);
	};

	const removeAddress = (index: number) => {
		const newAddresses = [...addresses];
		newAddresses.splice(index, 1);
		setAddresses(newAddresses);
	};

	const handleNext = () => {
		async function sendReq() {
			try {
				if (!description) {
					showToastError('Please enter a description');
				}
				setLoading(true);
				const { data } = await client.mutate({
					mutation: UPDATE_PROJECT_VERIFICATION,
					variables: {
						projectVerificationUpdateInput: {
							projectVerificationId: Number(verificationData?.id),
							step: PROJECT_VERIFICATION_STEPS.MANAGING_FUNDS,
							managingFunds: {
								description,
								relatedAddresses: addresses,
							},
						},
					},
				});
				setVerificationData(data.updateProjectVerificationForm);
				setLoading(false);
				setStep(7);
			} catch (error) {
				console.log('err', error);
			} finally {
				setLoading(false);
			}
		}
		sendReq();
	};

	return (
		<>
			<div>
				<H6 weight={700}>Managing funds</H6>
				<Lead>
					<br />
					The funds raised are expected to be used for public benefit
					and not for personal gain. How will you use the funds that
					your project raises? Please provide detailed funding/budget
					information as well as an overall roadmap or action plan of
					the project.
					<DescriptionInput
						value={description}
						name='link'
						placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
				applications"'
						onChange={e => setDescription(e.target.value)}
						required
					/>
					<div>Additional address</div>
					<AddressDescription>
						Please provide additional Ethereum wallet addresses used
						for managing funds within your project.
						<P>This is optional</P>
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
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(5)} label='<     PREVIOUS' />
					<Button
						onClick={handleNext}
						label='NEXT     >'
						loading={loading}
					/>
				</BtnContainer>
			</div>
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
	color: ${neutralColors.gray[900]};
	margin-top: 8px;
	margin-bottom: 24px;
	> * {
		margin-top: 4px;
		color: ${neutralColors.gray[800]};
	}
`;

const DescriptionInput = styled(TextArea)`
	margin-bottom: 32px;
	margin-top: 24px;
	height: 180px;
`;

export default ManageFundsIndex;
