import { Button } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { IProject, IWalletAddress } from '@/apollo/types/types';
import Input from '../../Input';
import { requiredOptions } from '@/lib/constants/regex';
import { client } from '@/apollo/apolloClient';
import { ADD_RECIPIENT_ADDRESS_TO_PROJECT } from '@/apollo/gql/gqlProjects';
import InlineToast, { EToastType } from '../../toasts/InlineToast';
import { networksParams } from '@/helpers/blockchain';
import { suggestNewAddress } from '@/lib/helpers';

interface IAddNewAddress {
	project: IProject;
	selectedWallet: IWalletAddress;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
	setSelectedWallet: Dispatch<SetStateAction<IWalletAddress | undefined>>;
	setAddresses: Dispatch<SetStateAction<IWalletAddress[]>>;
}

interface IAddressForm {
	address: string;
}

export const AddNewAddress: FC<IAddNewAddress> = ({
	project,
	selectedWallet,
	setProjects,
	setSelectedWallet,
	setAddresses,
}) => {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<IAddressForm>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

	const handleAdd = async (formData: IAddressForm) => {
		setLoading(true);
		const { address } = formData;
		try {
			const _address = getAddress(address);
			const { data } = await client.mutate({
				mutation: ADD_RECIPIENT_ADDRESS_TO_PROJECT,
				variables: {
					projectId: Number(project.id),
					networkId: selectedWallet.networkId,
					address: _address,
				},
			});
			setProjects((projects: IProject[]) => {
				const _projects = structuredClone(projects);
				const newProjects = [];
				for (let i = 0; i < _projects.length; i++) {
					const _project = _projects[i];
					if (_project.id === project.id) {
						_project.addresses = [
							...(_project.addresses || []),
							{
								address: _address,
								isRecipient: true,
								networkId: selectedWallet.networkId,
							},
						];
						newProjects.push(structuredClone(_project));
					} else {
						newProjects.push(_project);
					}
				}
				console.log('newProjects', newProjects);
				setSelectedWallet(undefined);
				return newProjects;
			});
			setAddresses(_addresses => {
				const _adds = structuredClone(_addresses);
				for (let i = 0; i < _adds.length; i++) {
					const _add = _adds[i];
					if (_add.networkId === selectedWallet.networkId) {
						_add.isRecipient = true;
						_add.address = _address;
					}
				}
				return _adds;
			});
		} catch (error: any) {
			if (error.message) {
				setError(
					'address',
					{ type: 'focus', message: error.message },
					{ shouldFocus: true },
				);
			}
		}

		setLoading(false);
	};

	const validateAddress = async (address: string) => {
		setLoading(true);
		if (!isAddress(address)) {
			setLoading(false);
			return 'Invalid address';
		}
		return true;
	};

	const chainName = selectedWallet.networkId
		? networksParams[selectedWallet.networkId].chainName
		: 'Unknown';

	return (
		<>
			<form onSubmit={handleSubmit(handleAdd)}>
				<StyledInput
					register={register}
					registerName='address'
					label={`Receiving address on 
						${chainName}`}
					registerOptions={{
						...requiredOptions.walletAddress,
						validate: validateAddress,
					}}
					placeholder='0x...'
					defaultValue={suggestNewAddress(project.addresses)}
					caption={`You can enter a new address to receive funds on ${chainName} network.`}
				/>
				{errors.address && (
					<StyledInlineToast
						type={EToastType.Error}
						message={errors.address?.message as string}
					/>
				)}
				<StyledButton
					size='small'
					label='SAVE ADDRESS'
					buttonType='secondary'
					type='submit'
					loading={loading}
				/>
			</form>
		</>
	);
};

const StyledInlineToast = styled(InlineToast)``;

const StyledInput = styled(Input)`
	margin-top: 24px;
`;

const StyledButton = styled(Button)`
	margin-top: 24px;
	margin-left: auto;
`;
