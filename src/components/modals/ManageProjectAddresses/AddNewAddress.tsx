import { Button } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { getAddress, isAddress, type Chain } from 'viem';
import { useIntl } from 'react-intl';
import { IProject, IWalletAddress } from '@/apollo/types/types';
import Input from '../../Input';
import { requiredOptions } from '@/lib/constants/regex';
import { client } from '@/apollo/apolloClient';
import { ADD_RECIPIENT_ADDRESS_TO_PROJECT } from '@/apollo/gql/gqlProjects';
import InlineToast, { EToastType } from '../../toasts/InlineToast';
import { suggestNewAddress } from '@/lib/helpers';
import { ChainType, NonEVMChain } from '@/types/config';
import { isSolanaAddress, isStellarAddress } from '@/lib/wallet';
import { getChainName } from '@/lib/network';

interface IAddNewAddress {
	project: IProject;
	selectedChain: Chain | NonEVMChain;
	setProject: Dispatch<SetStateAction<IProject>>;
	setSelectedChain: Dispatch<SetStateAction<Chain | NonEVMChain | undefined>>;
	setAddresses: Dispatch<SetStateAction<IWalletAddress[]>>;
}

interface IAddressForm {
	address: string;
	memo?: string;
}

export const AddNewAddress: FC<IAddNewAddress> = ({
	project,
	selectedChain,
	setProject,
	setSelectedChain,
	setAddresses,
}) => {
	const { formatMessage } = useIntl();
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<IAddressForm>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

	const chainType =
		'chainType' in selectedChain ? selectedChain.chainType : undefined;

	const isStellarChain = chainType === ChainType.STELLAR;

	const handleAdd = async (formData: IAddressForm) => {
		setLoading(true);
		const { address, memo } = formData;
		try {
			const _address =
				chainType &&
				[ChainType.SOLANA, ChainType.STELLAR].includes(chainType)
					? address
					: getAddress(address);
			await client.mutate({
				mutation: ADD_RECIPIENT_ADDRESS_TO_PROJECT,
				variables: {
					projectId: Number(project.id),
					networkId: selectedChain.id,
					chainType,
					address: _address,
					memo,
				},
			});
			setProject((project: IProject) => {
				const _project = structuredClone(project);
				_project.addresses = [
					...(_project.addresses || []),
					{
						address: _address,
						isRecipient: true,
						networkId: selectedChain.id,
						chainType,
					},
				];
				setSelectedChain(undefined);
				return _project;
			});
			setAddresses(_addresses => {
				const _adds = structuredClone(_addresses);
				_adds.push({
					address: _address,
					isRecipient: true,
					networkId: selectedChain.id,
					chainType,
				});
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
		if (chainType === ChainType.SOLANA) {
			if (!isSolanaAddress(address)) {
				setLoading(false);
				return 'Invalid Solana address';
			}
		} else if (isStellarChain) {
			if (!isStellarAddress(address)) {
				setLoading(false);
				return 'Invalid Stellar address';
			}
		} else if (!isAddress(address)) {
			setLoading(false);
			return 'Invalid ETH address';
		}
		return true;
	};

	const chainName = getChainName(selectedChain.id, chainType);

	return (
		<form onSubmit={handleSubmit(handleAdd)}>
			<StyledInput
				register={register}
				registerName='address'
				autoFocus
				label={`Receiving address on ${chainName}`}
				registerOptions={{
					...requiredOptions?.walletAddress,
					validate: validateAddress,
				}}
				placeholder={isStellarChain ? 'G...' : '0x...'}
				defaultValue={suggestNewAddress(
					project.addresses!,
					selectedChain,
				)}
				caption={`You can enter a new address to receive funds on ${chainName} network.`}
			/>
			{isStellarChain && (
				<StyledInput
					register={register}
					registerName='memo'
					label='Memo'
					placeholder={formatMessage({
						id: 'label.enter_the_memo',
					})}
					maxLength={28}
				/>
			)}
			{errors.address && (
				<InlineToast
					type={EToastType.Error}
					message={errors.address?.message as string}
				/>
			)}
			{isStellarChain && (
				<StyledInlineToast
					type={EToastType.Info}
					message={formatMessage({
						id: 'label.be_carefull_some_exchanges',
					})}
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
	);
};

const StyledInput = styled(Input)`
	margin-top: 24px;
`;

const StyledButton = styled(Button)`
	margin-top: 24px;
	margin-left: auto;
`;

const StyledInlineToast = styled(InlineToast)`
	padding: 16px 14px 16px 16px;
`;
