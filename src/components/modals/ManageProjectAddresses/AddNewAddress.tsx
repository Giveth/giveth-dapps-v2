import { B, Button, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { FC, useState } from 'react';
import { IProject } from '@/apollo/types/types';
import Input from '../../Input';
import { requiredOptions } from '@/lib/constants/regex';
import { client } from '@/apollo/apolloClient';
import { ADD_RECIPIENT_ADDRESS_TO_PROJECT } from '@/apollo/gql/gqlProjects';
import config from '@/configuration';
import InlineToast, { EToastType } from '../../toasts/InlineToast';
import { generatePolygonAddress } from '@/lib/helpers';

interface IAddNewAddress {
	project: IProject;
}

interface IAddressForm {
	address: string;
}

export const AddNewAddress: FC<IAddNewAddress> = ({ project }) => {
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
					networkId: config.POLYGON_NETWORK_NUMBER,
					address: _address,
				},
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

	return (
		<>
			<Content>
				<P>Adding Polygon address for</P>
				<B>{project.title}</B>
			</Content>
			<form onSubmit={handleSubmit(handleAdd)}>
				<Input
					register={register}
					registerName='address'
					label='Enter a Polygon address'
					registerOptions={{
						...requiredOptions.walletAddress,
						validate: validateAddress,
					}}
					defaultValue={generatePolygonAddress(project.addresses)}
				/>
				{errors.address && (
					<StyledInlineToast
						type={EToastType.Error}
						message={errors.address?.message as string}
					/>
				)}
				<Button
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

const Content = styled.div`
	margin-bottom: 32px;
	& > div {
		display: inline-block;
		padding-right: 4px;
	}
`;

const StyledInlineToast = styled(InlineToast)`
	margin-top: 0;
`;
