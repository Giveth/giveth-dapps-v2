import { Button, H5, mediaQueries } from '@giveth/ui-design-system';
import { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
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
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { gToast, ToastType } from '@/components/toasts';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { useAppDispatch } from '@/features/hooks';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';

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

	const dispatch = useAppDispatch();
	const { account } = useWeb3React();
	const [updateUser] = useMutation(UPDATE_USER);

	const { url, onDelete } = useUploadProps;

	console.log('user', user);
	console.log('data', pfpData);

	const nftUrl = selectedPFP?.imageIpfs
		? convertIPFSToHTTPS(selectedPFP?.imageIpfs)
		: undefined;
	console.log('nftUrl', nftUrl);
	const onSaveAvatar = async () => {
		try {
			console.log('Saving');
			const { data: response } = await updateUser({
				variables: {
					avatar: nftUrl ? nftUrl : url,
				},
			});
			console.log('Res', response);
			if (response.updateUser) {
				account && dispatch(fetchUserByAddress(account));
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				onDelete();
			} else {
				throw 'updateUser false';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			console.log(error);
			captureException(error, {
				tags: {
					section: 'onSaveAvatar',
				},
			});
		}
	};

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
								onClick={onSaveAvatar}
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
									onClick={() => setSelectedPFP(pfp)}
									image={pfp.imageIpfs}
									key={pfp.tokenId}
									isSelected={
										pfp.tokenId === selectedPFP?.tokenId
									}
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
								disabled={!nftUrl}
								onClick={onSaveAvatar}
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
