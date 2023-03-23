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
import { TabItem } from '../styled-components/Tabs';

interface IUploadProfilePicModal extends IModal {
	user: IUser;
}

const tabs = [
	{ id: 1, title: 'Upload Image' },
	{ id: 2, title: 'My NFTs' },
];

const UploadProfilePicModal = ({
	setShowModal,
	user,
}: IUploadProfilePicModal) => {
	const useUploadProps = useUpload();
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [activeTab, setActiveTab] = React.useState(1);
	const { url, onDelete } = useUploadProps;

	console.log('user', user);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Upload Your Images or NFTs'
			headerTitlePosition='left'
		>
			<Wrapper>
				<Flex gap='16px'>
					{tabs.map(i => (
						<TabItem
							onClick={() => setActiveTab(i.id)}
							className={activeTab === i.id ? 'active' : ''}
							key={i.id}
							active={activeTab === i.id}
						>
							{i.title}
						</TabItem>
					))}
				</Flex>
				{activeTab === 1 && (
					<Flex flexDirection='column' gap='36px'>
						<ImageUploader {...useUploadProps} />
						<Flex
							flexDirection='row'
							justifyContent='space-between'
						>
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
					</Flex>
				)}
				{activeTab === 2 && (
					<Flex flexDirection='column' gap='36px'>
						<ImageUploader {...useUploadProps} />
						<Flex
							flexDirection='row'
							justifyContent='space-between'
						>
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
					</Flex>
				)}
			</Wrapper>
		</Modal>
	);
};

export default UploadProfilePicModal;

const Wrapper = styled.div`
	padding: 24px;
	${mediaQueries.laptopL} {
		width: 1100px;
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
