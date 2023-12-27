import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useNetwork } from 'wagmi';
import { WriteContractResult } from '@wagmi/core';
import { useRouter } from 'next/router';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import SwitchNetwork from '@/components/modals/SwitchNetwork';
import useCreateAnchorContract from '@/hooks/useCreateAnchorContract';
import { IProject, IProjectEdition } from '@/apollo/types/types';
import StorageLabel from '@/lib/localStorage';
import { slugToSuccessView, slugToProjectView } from '@/lib/routeCreators';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

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
	const { chain } = useNetwork();
	const [showSwitchNetworkModal, setShowSwitchNetworkModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [txResult, setTxResult] = useState<WriteContractResult>();
	const router = useRouter();

	const isDraft = project?.status.name === EProjectStatus.DRAFT;

	const isEditMode = !!project;

	const updatedCloseModal = () => {
		if (!txResult) {
			//Show the user did not complete the transaction
			console.log('User did not complete the transaction');
			alert(
				'You did not complete the transaction but your project was created',
			);
			//handle success project
		}
		closeModal();
	};

	const isOnOptimism = chain
		? chain.id === config.OPTIMISM_NETWORK_NUMBER
		: false;

	const { writeAsync } = useCreateAnchorContract({
		adminUser: addedProjectState?.adminUser,
		id: addedProjectState?.id,
		slug: addedProjectState?.slug!,
	});

	const handleButtonClick = async () => {
		if (!isOnOptimism) {
			setShowSwitchNetworkModal(true);
		} else {
			try {
				setIsLoading(true);
				const tx = await writeAsync?.();
				setTxResult(tx);
				console.log('TX', tx);
				//Call backend to update project
				if (tx?.hash) {
					if (!isEditMode || (isEditMode && isDraft)) {
						console.log('User completed the transaction !EditMode');

						await router.push(
							slugToSuccessView(addedProjectState.slug),
						);
					} else {
						console.log('User completed the transaction EditMode');
						await router.push(
							slugToProjectView(addedProjectState.slug),
						);
					}
				}
				setShowModal(false); // Close the modal
			} catch (error) {
				console.error('Error signing contract:', error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
	}, []);

	console.log('Rendering AlloProtocolModal');
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
			{showSwitchNetworkModal && (
				<SwitchNetwork
					customNetworks={[config.OPTIMISM_NETWORK_NUMBER]}
					setShowModal={setShowSwitchNetworkModal}
				/>
			)}
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
