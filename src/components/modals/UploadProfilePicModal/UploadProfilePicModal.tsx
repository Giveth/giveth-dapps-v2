import { Button, H5, mediaQueries } from '@giveth/ui-design-system';
import { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import useUpload from '@/hooks/useUpload';
import ImageUploader from '../../ImageUploader';
import { Flex } from '../../styled-components/Flex';
import { Modal } from '../Modal';
import { IUser } from '@/apollo/types/types';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { TabItem } from '../../styled-components/Tabs';
import { IUserNFT } from '../../views/userProfile/UserProfile.view';
import PfpItem from './PfpItem';

interface IUploadProfilePicModal extends IModal {
	user: IUser;
	pfpData?: IUserNFT[];
}

const tabs = [
	{ id: 1, title: 'Upload Image' },
	{ id: 2, title: 'My NFTs' },
];

const UploadProfilePicModal = ({
	setShowModal,
	user,
	pfpData,
}: IUploadProfilePicModal) => {
	const useUploadProps = useUpload();
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [activeTab, setActiveTab] = useState(1);
	const [selectedPFP, setSelectedPFP] = useState<IUserNFT>();

	const { url, onDelete } = useUploadProps;

	console.log('user', user);
	console.log('data', pfpData);

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
						<CustomH5>Your Unique Giveth’s PFP Artwork</CustomH5>
						<Flex gap='25px'>
							{pfpData?.map(pfp => (
								<PfpItem
									image={pfp.imageIpfs}
									key={pfp.tokenId}
									isSelected={true}
									id={pfp.tokenId}
								/>
							))}
						</Flex>
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

const CustomH5 = styled(H5)`
	text-align: left;
	margin-top: 40px;
`;
