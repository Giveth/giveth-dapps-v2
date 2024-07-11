import styled from 'styled-components';
import { FC, useState } from 'react';
import {
	Button,
	IconBulbOutline32,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { useAccount, useSwitchChain } from 'wagmi';
import { useIntl } from 'react-intl';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { Address, isAddress } from 'viem';
import { wagmiConfig } from '@/wagmiConfigs';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import { CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY } from '@/apollo/gql/gqlSuperfluid';
import { client } from '@/apollo/apolloClient';
import { useDonateData } from '@/context/donate.context';
import { IModal } from '@/types/common';
import createProfileABI from '@/artifacts/createProfile.json';
import { generateRandomNonce, showToastError } from '@/lib/helpers';
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
	const { chain } = useAccount();
	const [isLoading, setIsLoading] = useState(false);
	const [txResult, setTxResult] = useState<Address>();

	const { switchChain } = useSwitchChain();
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

	const handleButtonClick = async () => {
		if (!isOnOptimism) {
			switchChain?.({ chainId: config.OPTIMISM_NETWORK_NUMBER });
		} else {
			try {
				setIsLoading(true);
				if (
					!project?.adminUser.walletAddress ||
					!isAddress(project?.adminUser.walletAddress)
				) {
					throw new Error('Invalid Project Admin Address');
				}
				const hash = await writeContract(wagmiConfig, {
					address: config.OPTIMISM_CONFIG.anchorRegistryAddress,
					functionName: 'createProfile',
					abi: createProfileABI.abi,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					args: [
						generateRandomNonce(), //nonce
						project?.id!,
						{
							protocol: 1,
							pointer: '',
						},
						project?.adminUser.walletAddress, //admin user wallet address
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
							projectId: Number(project.id),
							networkId: config.OPTIMISM_NETWORK_NUMBER,
							address: contractAddress,
							txHash: hash,
						},
					});
					await fetchProject();
					onModalCompletion();
				}
				setShowModal(false); // Close the modal
			} catch (error) {
				showToastError(error);
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
			headerTitle='Recurring Donation Setup'
			headerTitlePosition='left'
		>
			<Container>
				<P>
					{formatMessage({
						id: 'label.you_are_the_first_donor_to_make_a_recurring_donation_to_this_project',
					})}{' '}
				</P>
				<Ellipse />
				<br />
				<P>
					{formatMessage({
						id: 'label.there_will_be_one_extra_transaction_you_need_to_sign_to',
					})}{' '}
					<span style={{ whiteSpace: 'nowrap', display: 'inline' }}>
						Optimism
					</span>
					.
				</P>
				<Ellipse />
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
