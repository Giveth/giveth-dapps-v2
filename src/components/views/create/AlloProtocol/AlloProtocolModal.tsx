import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { WriteContractResult } from '@wagmi/core';
import { useRouter } from 'next/router';
import { waitForTransaction } from '@wagmi/core';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import useCreateAnchorContract from '@/hooks/useCreateAnchorContract';
import { IProject, IProjectEdition } from '@/apollo/types/types';
import StorageLabel from '@/lib/localStorage';
import { slugToSuccessView, slugToProjectView } from '@/lib/routeCreators';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

interface IAlloProtocolModal extends IModal {
	project?: IProjectEdition; //If undefined, it means we are in create mode
	addedProjectState: IProject;
}

function extractContractAddressFromString(text: string) {
	// The hexadecimal string starts at the 282th character (0-indexed)
	// We use a regex to match any characters up to that point, then capture the next 40 characters
	const regex = /.{282}([0-9a-fA-F]{40})/;
	const match = text.match(regex);

	if (match && match[1]) {
		// Prepending '0x' to the matched string
		return '0x' + match[1];
	} else {
		return 'No matching pattern found';
	}
}

const AlloProtocolModal: FC<IAlloProtocolModal> = ({
	setShowModal,
	addedProjectState,
	project,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chain } = useNetwork();
	const [isLoading, setIsLoading] = useState(false);
	const [txResult, setTxResult] = useState<WriteContractResult>();
	const router = useRouter();
	const { switchNetwork } = useSwitchNetwork();

	const isDraft =
		project?.status.name === EProjectStatus.DRAFT ||
		addedProjectState.status?.name === EProjectStatus.DRAFT;

	const isEditMode = !!project;

	const updatedCloseModal = () => {
		if (!txResult) {
			//Show the user did not complete the transaction
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
			switchNetwork?.(config.OPTIMISM_NETWORK_NUMBER);
		} else {
			try {
				setIsLoading(true);
				const tx = await writeAsync?.();
				setTxResult(tx);
				if (tx?.hash) {
					const data = await waitForTransaction({
						hash: tx.hash,
						chainId: config.OPTIMISM_NETWORK_NUMBER,
					});
					const profileId = data.logs[0].topics[1];
					const contractAddress = extractContractAddressFromString(
						data.logs[0].data,
					);
					console.log('Test Data', data);
					console.log('Test ProfileID = ', profileId);
					console.log('Test Contract Address = ', data.logs[0].data);
					console.log('Test Contract Address = ', contractAddress);
				}
				//Call backend to update project
				if (tx?.hash) {
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
