import { B, Button, IconNetwork32, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { FC, useState } from 'react';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from './Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IProject } from '@/apollo/types/types';
import Input from '../Input';
import { requiredOptions } from '@/lib/constants/regex';
import { client } from '@/apollo/apolloClient';
import { ADD_RECIPIENT_ADDRESS_TO_PROJECT } from '@/apollo/gql/gqlProjects';
import config from '@/configuration';
import InlineToast, { EToastType } from '../toasts/InlineToast';
import type { IModal } from '@/types/common';

interface IAddPolygonAddressModal extends IModal {
	project: IProject;
}

interface IAddressForm {
	address: string;
}

export const AddPolygonAddressModal: FC<IAddPolygonAddressModal> = ({
	project,
	setShowModal,
}) => {
	const [loading, setLoading] = useState(false);
	const [submitError, setSubmitError] = useState();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const {
		register,
		handleSubmit,
		formState: { errors },
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
					networkId: config.POLYGON_NETWORK.id,
					address: _address,
				},
			});
		} catch (error) {
			console.log('error', { error });
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
		<Modal
			headerIcon={<IconNetwork32 />}
			headerTitle='Add polygon address'
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<Content>
					<P>Adding polygon address for</P>
					<B>{project.title}</B>
				</Content>
				<form onSubmit={handleSubmit(handleAdd)}>
					<Input
						register={register}
						registerName='address'
						label='Enter a polygon address'
						registerOptions={{
							...requiredOptions.walletAddress,
							validate: validateAddress,
						}}
					/>
					{errors.address && (
						<StyledInlineToast
							type={EToastType.Error}
							message={errors.address.message as string}
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
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	text-align: left;
	padding: 32px 24px 24px;
	${mediaQueries.tablet} {
		width: 462px;
	}
`;

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
