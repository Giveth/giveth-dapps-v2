import { Button, mediaQueries } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import useUpload from '@/hooks/useUpload';
import ImageUploader from '../ImageUploader';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import { IUser } from '@/apollo/types/types';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IUploadProfilePicModal extends IModal {
	user: IUser;
}

const UploadProfilePicModal = ({
	setShowModal,
	user,
}: IUploadProfilePicModal) => {
	const useUploadProps = useUpload();
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const { url, onDelete } = useUploadProps;

	console.log('user', user);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.edit_profile',
			})}
			headerTitlePosition='left'
		>
			<Wrapper>
				<Flex flexDirection='column' gap='36px'>
					<ImageUploader {...useUploadProps} />
					<Button
						buttonType='secondary'
						label='SAVE'
						disabled={!url}
					/>
					<TextButton
						buttonType='texty'
						label={formatMessage({
							id: 'label.cancel',
						})}
						onClick={() => {
							onDelete();
						}}
					/>
				</Flex>
			</Wrapper>
		</Modal>
	);
};

export default UploadProfilePicModal;

const Wrapper = styled.div`
	padding: 24px;
	${mediaQueries.tablet} {
		width: 448px;
	}
`;

const TextButton = styled(Button)<{ color?: string }>`
	color: ${props => props.color};
	text-transform: uppercase;

	&:hover {
		background-color: transparent;
		color: ${props => props.color};
	}
`;
