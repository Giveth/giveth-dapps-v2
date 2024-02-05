import styled from 'styled-components';
import { FC, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { WriteContractResult } from '@wagmi/core';
import { waitForTransaction } from '@wagmi/core';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import useCreateAnchorContract from '@/hooks/useCreateAnchorContract';
import { CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY } from '@/apollo/gql/gqlSuperfluid';
import { client } from '@/apollo/apolloClient';
import { useDonateData } from '@/context/donate.context';
import { IModal } from '@/types/common';

interface IAlloProtocolModal extends IModal {
	onModalCompletion: () => void;
}

export function extractContractAddressFromString(text: string) {
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

const AlloProtocolFirstDonationModal: FC<IAlloProtocolModal> = ({
	setShowModal,
	onModalCompletion,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chain } = useNetwork();
	const [isLoading, setIsLoading] = useState(false);
	const [txResult, setTxResult] = useState<WriteContractResult>();

	const { switchNetwork } = useSwitchNetwork();
	const { project, fetchProject } = useDonateData();
	const { formatMessage } = useIntl();
	const updatedCloseModal = () => {
		if (!txResult) {
			//Show the user did not complete the transaction
			alert('You did not complete the transaction.');
			//handle success project
		}
		closeModal();
	};

	const isOnOptimism = chain
		? chain.id === config.OPTIMISM_NETWORK_NUMBER
		: false;
	const { writeAsync } = useCreateAnchorContract({
		adminUser: project?.adminUser,
		id: project?.id,
		slug: project?.slug!,
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

					const contractAddress = extractContractAddressFromString(
						data.logs[0].data,
					);
					//Call backend to update project
					await client.mutate({
						mutation: CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY,
						variables: {
							projectId: Number(project.id),
							networkId: config.OPTIMISM_NETWORK_NUMBER,
							address: contractAddress,
							txHash: tx.hash,
						},
					});
				}
				if (tx?.hash) {
					await fetchProject();
					onModalCompletion();
				}
				setShowModal(false); // Close the modal
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Modal
			closeModal={updatedCloseModal}
			isAnimating={isAnimating}
			headerIcon={<IconBulbOutline32 />}
			headerTitle='Set up Allo Protocol Registry'
			headerTitlePosition='left'
		>
			<Container>
				<P>
					{formatMessage({ id: 'label.guess_what_you_are_awsome' })}{' '}
				</P>
				<br />
				<ItemContainer>
					<P>
						{formatMessage({
							id: 'label.you_are_the_first_donor_to_make_a_recurring_donation_to_this_project',
						})}{' '}
					</P>
					<Ellipse />
				</ItemContainer>
				<br />
				<ItemContainer>
					<P>
						{formatMessage({
							id: 'label.there_will_be_one_extra_transaction_you_need_to_sign_to',
						})}{' '}
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
					label={
						isOnOptimism
							? formatMessage({ id: 'label.confirm' })
							: `${formatMessage({
									id: 'label.switch_to',
								})} Optimism`
					}
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

export default AlloProtocolFirstDonationModal;
