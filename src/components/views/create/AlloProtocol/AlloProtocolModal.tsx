import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useAccount, useSwitchChain } from 'wagmi';
import { useRouter } from 'next/router';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { Address } from 'viem';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import { IProject, IProjectEdition } from '@/apollo/types/types';
import StorageLabel from '@/lib/localStorage';
import { slugToSuccessView, slugToProjectView } from '@/lib/routeCreators';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY } from '@/apollo/gql/gqlSuperfluid';
import { client } from '@/apollo/apolloClient';
import { extractContractAddressFromString } from '../../donate/AlloProtocolFirstDonationModal';
import { wagmiConfig } from '@/wagmiconfig';
import createProfileABI from '@/artifacts/createProfile.json';

interface IAlloProtocolModal extends IModal {
	project?: IProjectEdition; //If undefined, it means we are in create mode
	addedProjectState: IProject;
}

const AlloProtocolModal: FC<IAlloProtocolModal> = ({
	setShowModal,
	addedProjectState,
	project,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chain } = useAccount();
	const [isLoading, setIsLoading] = useState(false);
	const [txResult, setTxResult] = useState<Address>();
	const router = useRouter();
	const { switchChain } = useSwitchChain();

	const isDraft =
		project?.status.name === EProjectStatus.DRAFT ||
		addedProjectState.status?.name === EProjectStatus.DRAFT;

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

	const isOnOptimism = chain
		? chain.id === config.OPTIMISM_NETWORK_NUMBER
		: false;

	const handleButtonClick = async () => {
		if (!isOnOptimism) {
			switchChain?.({ chainId: config.OPTIMISM_NETWORK_NUMBER });
		} else {
			try {
				setIsLoading(true);
				const hash = await writeContract(wagmiConfig, {
					address: config.OPTIMISM_CONFIG.anchorRegistryAddress,
					functionName: 'createProfile',
					abi: createProfileABI.abi,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					args: [
						+addedProjectState?.id!, // project id
						addedProjectState?.slug!,
						{
							protocol: 1,
							pointer: '',
						},
						addedProjectState?.adminUser.walletAddress, //admin user wallet address
						[],
					],
				});
				setTxResult(hash);
				if (hash) {
					const data = await waitForTransactionReceipt(wagmiConfig, {
						hash: hash,
						chainId: config.OPTIMISM_NETWORK_NUMBER,
					});

					const contractAddress = extractContractAddressFromString(
						data.logs[0].data,
					);
					//Call backend to update project
					await client.mutate({
						mutation: CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY,
						variables: {
							projectId: Number(addedProjectState.id),
							networkId: config.OPTIMISM_NETWORK_NUMBER,
							address: contractAddress,
							txHash: hash,
						},
					});
					if (!isEditMode || (isEditMode && isDraft)) {
						await router.push(
							slugToSuccessView(addedProjectState.slug),
						);
					} else {
						await router.push(
							slugToProjectView(addedProjectState.slug),
						);
					}
				}
				setShowModal(false); // Close the modal
			} catch (error) {
				console.log('Error Contract', error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
	}, []);

	return (
		<Modal
			closeModal={updatedCloseModal}
			isAnimating={isAnimating}
			headerIcon={<IconBulbOutline32 />}
			headerTitle='Set up Allo Protocol Registry'
			headerTitlePosition='left'
		>
			<Container>
				{/* {isOnOptimism ? 'On Optimism' : 'Not On Optimism'}
				{addedProjectState.id} */}
				<P>
					Your project has now been created, next you will need to
					sign a transaction to register it to Allo Protocol on
					Optimism.
				</P>
				<br />
				<ItemContainer>
					<P>
						Your project will be included in a shared registry of
						public goods projects with Gitcoin and others. You will
						also set up your project to receive recurring donations.
					</P>
					<Ellipse />
				</ItemContainer>
				<br />
				<ItemContainer>
					<P>
						There will be one extra transaction you need to sign to
						enable recurring donations for this project on{' '}
						<span
							style={{ whiteSpace: 'nowrap', display: 'inline' }}
						>
							Optimism
						</span>
						.
					</P>
					<Ellipse />
				</ItemContainer>
				<br />
				<CustomButton
					label={isOnOptimism ? 'Confirm' : 'Switch To Optimism'}
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
