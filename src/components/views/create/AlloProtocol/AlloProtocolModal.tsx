import styled from 'styled-components';
import { FC, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useNetwork } from 'wagmi';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import SwitchNetwork from '@/components/modals/SwitchNetwork';
import useCreateAnchorContract from '@/hooks/useCreateAnchorContract';
import { IProject } from '@/apollo/types/types';
import StorageLabel from '@/lib/localStorage';

interface IAlloProtocolModal extends IModal {
	addedProjectState: IProject;
}

const AlloProtocolModal: FC<IAlloProtocolModal> = ({
	setShowModal,
	addedProjectState,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chain } = useNetwork();
	const [showSwitchNetworkModal, setShowSwitchNetworkModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
				console.log('TX', tx);
				//Call backend to update project
				setShowModal(false); // Close the modal
			} catch (error) {
				console.error('Error signing contract:', error);
			} finally {
				localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
				setIsLoading(false);
			}
		}
	};

	console.log('Rendering AlloProtocolModal');
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconBulbOutline32 />}
			headerTitle='Set up Allo Protocol Registry'
			headerTitlePosition='left'
		>
			<Container>
				{isOnOptimism ? 'On Optimism' : 'Not On Optimism'}
				{addedProjectState.id}
				<P>Set up your profile on the Allo protocol Registry </P>
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
						enable recurring donations for this project on Optimism.
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

const ButtonContainer = styled.div`
	width: 100%;
`;

export default AlloProtocolModal;
