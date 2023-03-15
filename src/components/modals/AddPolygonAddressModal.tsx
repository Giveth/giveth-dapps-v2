import { Button, IconNetwork32, P } from '@giveth/ui-design-system';
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
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IAddressForm>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

	const handleAdd = async (formData: IAddressForm) => {
		setLoading(true);
		const { address } = formData;
		const _address = getAddress(address);
		setLoading(false);
	};

	const validateAddress = async (address: string) => {
		setLoading(true);
		if (!isAddress(address)) return 'Invalid address';
		setLoading(false);
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
				<P>Adding polygon address for {project.title}</P>
				<form onSubmit={handleSubmit(handleAdd)}>
					<Input
						register={register}
						registerName='address'
						label='Enter a polygon address'
						registerOptions={{
							...requiredOptions.walletAddress,
							validate: validateAddress,
						}}
						error={errors.address}
					/>
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
