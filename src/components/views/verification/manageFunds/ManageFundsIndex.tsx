import { Button, H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import AddAddressModal from '@/components/views/verification/manageFunds/AddAddressModal';
import UserAddress from '@/components/views/verification/manageFunds/UserAddress';
import { ContentSeparator, BtnContainer } from '../VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import {
	EVerificationSteps,
	IProjectManagingFunds,
} from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { showToastError } from '@/lib/helpers';
import { OutlineStyled } from '../common.styled';
import DescriptionInput from '@/components/DescriptionInput';
import { requiredOptions } from '@/lib/constants/regex';

export interface IAddress {
	address: string;
	title: string;
	networkId: number;
}

const ManageFundsIndex = () => {
	const [loading, setLoading] = useState(false);
	const [showAddressModal, setShowAddressModal] = useState(false);
	const { setStep, setVerificationData, verificationData, isDraft } =
		useVerificationData();

	const managingFundsData = verificationData?.managingFunds;
	const { relatedAddresses, description } = managingFundsData || {};

	const [addresses, setAddresses] = useState<IAddress[]>(
		relatedAddresses || [],
	);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<IProjectManagingFunds>();

	useEffect(() => {
		if (description) setValue('description', description);
	}, [description]);

	const addAddress = (addressObj: IAddress) => {
		setAddresses([...addresses, addressObj]);
	};

	const removeAddress = (index: number) => {
		const newAddresses = [...addresses];
		newAddresses.splice(index, 1);
		setAddresses(newAddresses);
	};

	const handleNext = (formData: IProjectManagingFunds) => {
		async function sendReq() {
			try {
				setLoading(true);
				const { data } = await client.mutate({
					mutation: UPDATE_PROJECT_VERIFICATION,
					variables: {
						projectVerificationUpdateInput: {
							projectVerificationId: Number(verificationData?.id),
							step: EVerificationSteps.MANAGING_FUNDS,
							managingFunds: {
								description: formData.description,
								relatedAddresses: addresses,
							},
						},
					},
				});
				setVerificationData(data.updateProjectVerificationForm);
				setLoading(false);
			} catch (error) {
				showToastError(error);
			} finally {
				setLoading(false);
			}
		}
		if (isDraft) {
			sendReq();
		} else {
			setStep(7);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(handleNext)}>
				<div>
					<H6 weight={700}>Managing funds</H6>
					<Lead>
						<br />
						The funds raised are expected to be used for public
						benefit and not for personal gain. How will you use the
						funds that your project raises? Please provide detailed
						funding/budget information as well as an overall roadmap
						or action plan of the project.
						<DescriptionInputStyled
							register={register}
							registerName='description'
							registerOptions={requiredOptions.field}
							error={errors.description}
							height='180px'
							placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
				applications"'
							disabled={!isDraft}
						/>
						<div>Additional address</div>
						<AddressDescription>
							Please provide additional Ethereum wallet addresses
							used for managing funds within your project.
							<P>This is optional</P>
						</AddressDescription>
						{isDraft && (
							<OutlineStyled
								onClick={() => setShowAddressModal(true)}
								label='ADD ADDRESS'
								buttonType='primary'
							/>
						)}
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
						<Button
							onClick={() => setStep(5)}
							label='<     PREVIOUS'
						/>
						<Button
							label='NEXT     >'
							loading={loading}
							type='submit'
						/>
					</BtnContainer>
				</div>
			</form>
			{showAddressModal && (
				<AddAddressModal
					addAddress={addAddress}
					setShowModal={setShowAddressModal}
					addresses={addresses}
				/>
			)}
		</>
	);
};

const AddressDescription = styled(P)`
	color: ${neutralColors.gray[900]};
	margin-top: 8px;
	margin-bottom: 24px;
	> * {
		margin-top: 4px;
		color: ${neutralColors.gray[800]};
	}
`;

const DescriptionInputStyled = styled(DescriptionInput)`
	margin-top: 24px;
`;

export default ManageFundsIndex;
