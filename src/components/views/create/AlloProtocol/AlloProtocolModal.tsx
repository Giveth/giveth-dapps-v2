import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useSwitchChain } from 'wagmi';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { Address } from 'viem';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import {
	IAnchorContractBasicData,
	IProject,
	IProjectEdition,
} from '@/apollo/types/types';
import StorageLabel from '@/lib/localStorage';
import { slugToSuccessView, slugToProjectView } from '@/lib/routeCreators';
import { CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY } from '@/apollo/gql/gqlSuperfluid';
import { client } from '@/apollo/apolloClient';
import { extractContractAddressFromString } from '../../donate/Recurring/AlloProtocolFirstDonationModal';
import { wagmiConfig } from '@/wagmiConfigs';
import createProfileABI from '@/artifacts/createProfile.json';
import { generateRandomNonce } from '@/lib/helpers';

interface IAlloProtocolModal extends IModal {
	project?: IProjectEdition; //If undefined, it means we are in create mode
	addedProjectState: IProject;
	baseAnchorContract?: IAnchorContractBasicData;
	opAnchorContract?: IAnchorContractBasicData;
}

export const saveAnchorContract = async ({
	addedProjectState,
	chainId,
	recipientAddress,
	ownerAddres,
	isDraft,
	anchorContract,
	userId,
}: {
	addedProjectState?: IProject;
	chainId: number;
	recipientAddress?: string;
	ownerAddres?: string;
	isDraft?: boolean;
	anchorContract?: IAnchorContractBasicData;
	userId?: string;
}) => {
	try {
		if (anchorContract && addedProjectState) {
			// Used on creation when there's already an anchor contract saved
			return await client.mutate({
				mutation: CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY,
				variables: {
					projectId: Number(addedProjectState.id),
					networkId: chainId,
					address: anchorContract.contractAddress,
					recipientAddress,
					txHash: anchorContract.hash,
				},
			});
		}
		const isOptimism = chainId === config.OPTIMISM_NETWORK_NUMBER;
		const hash = await writeContract(wagmiConfig, {
			address: isOptimism
				? config.OPTIMISM_CONFIG.anchorRegistryAddress
				: config.BASE_CONFIG.anchorRegistryAddress,
			functionName: 'createProfile',
			abi: createProfileABI.abi,
			chainId,
			args: [
				generateRandomNonce(), //nonce
				addedProjectState
					? `giveth_project:${addedProjectState?.id!}`
					: `giveth_user:${userId || 'unknown'}`,
				{
					protocol: 1,
					pointer: '',
				},
				addedProjectState
					? addedProjectState?.adminUser?.walletAddress
					: ownerAddres, //admin user wallet address
				[],
			],
		});
		if (hash) {
			const data = await waitForTransactionReceipt(wagmiConfig, {
				hash: hash,
				chainId,
			});

			const contractAddress = extractContractAddressFromString(
				data.logs[0].data,
			);

			if (isDraft || !addedProjectState) {
				return { contractAddress, hash };
			} else if (addedProjectState) {
				//Call backend to update project
				await client.mutate({
					mutation: CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY,
					variables: {
						projectId: Number(addedProjectState.id),
						networkId: chainId,
						address: contractAddress,
						recipientAddress,
						txHash: hash,
					},
				});
			}
		}
	} catch (error) {
		console.error('Error Contract', error);
		throw error;
	}
};

const AlloProtocolModal: FC<IAlloProtocolModal> = ({
	setShowModal,
	addedProjectState,
	project,
	baseAnchorContract,
	opAnchorContract,
}) => {
	const { switchChain } = useSwitchChain();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [isLoading, setIsLoading] = useState(false);
	const [txResult, setTxResult] = useState<Address>();
	const router = useRouter();
	const { formatMessage } = useIntl();

	const isEditMode = !!project;

	const updatedCloseModal = () => {
		if (!txResult && !isEditMode) {
			//Show the user did not complete the transaction
			alert(
				'You did not complete the transaction but your project was created',
			);
			localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
			router.push(slugToSuccessView(addedProjectState.slug));
			//handle success project
		}
		closeModal();
	};

	const handleButtonClick = async () => {
		try {
			if (!addedProjectState) return;
			setIsLoading(true);
			// Handle Base anchor contract
			if (baseAnchorContract?.recipientAddress) {
				switchChain?.({
					chainId: config.BASE_NETWORK_NUMBER,
				});
				await saveAnchorContract({
					addedProjectState,
					chainId: config.BASE_NETWORK_NUMBER,
					recipientAddress: baseAnchorContract.recipientAddress,
					anchorContract: baseAnchorContract,
				});
			}

			// Handle Optimism anchor contract
			if (opAnchorContract?.recipientAddress) {
				switchChain?.({
					chainId: config.OPTIMISM_NETWORK_NUMBER,
				});
				await saveAnchorContract({
					addedProjectState,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					recipientAddress: opAnchorContract.recipientAddress,
					anchorContract: opAnchorContract,
				});
			}
			setShowModal(false); // Close the modal
			await router.push(slugToProjectView(addedProjectState.slug));
		} catch (error) {
			console.error('Error Contract', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
	}, []);

	const opAnchorReady = opAnchorContract?.recipientAddress;
	const baseAnchorReady = baseAnchorContract?.recipientAddress;

	return (
		<Modal
			closeModal={updatedCloseModal}
			isAnimating={isAnimating}
			headerIcon={<IconBulbOutline32 />}
			headerTitle='Recurring Donation Setup'
			headerTitlePosition='left'
		>
			<Container>
				{/* {isOnOptimism ? 'On Optimism' : 'Not On Optimism'}
				{addedProjectState.id} */}
				<P>
					{formatMessage({
						id: 'label.recurring_donation_setup_1',
					})}
				</P>
				<br />
				<P>
					{formatMessage({
						id: 'label.recurring_donation_setup_2',
					})}
					<span style={{ whiteSpace: 'nowrap', display: 'inline' }}>
						{opAnchorReady && baseAnchorReady
							? 'Base & Optimsim'
							: opAnchorReady
								? 'Optimism'
								: baseAnchorReady && 'Base'}
					</span>
					.
				</P>
				<Ellipse />
				<br />
				<CustomButton
					label={'Confirm'}
					onClick={handleButtonClick}
					loading={isLoading}
					disabled={isLoading}
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 24px;
	text-align: left;
	max-width: 500px;
`;

const ItemContainer = styled.div`
	position: relative;
	padding-left: 8px;
`;

const Ellipse = styled.div`
	position: absolute;
	top: 8px;
	left: -8px;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: ${brandColors.giv[600]};
	box-shadow: 0 0 0 4px ${brandColors.giv[100]};
`;

const CustomButton = styled(Button)`
	width: 100%;
`;

export default AlloProtocolModal;
