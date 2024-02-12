import {
	IconWalletOutline32,
	neutralColors,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState, Dispatch, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import { Chain } from 'viem';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IProject, IWalletAddress } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import { NetworkWalletAddress } from './NetworkWalletAddress';
import { AddNewAddress } from './AddNewAddress';
import { getChainName } from '@/lib/network';
import { NonEVMChain } from '@/types/config';
import type { IModal } from '@/types/common';

const { CHAINS } = config;

interface IModalProps extends IModal {
	project: IProject;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

export const ManageProjectAddressesModal: FC<IModalProps> = props => {
	const { project, setShowModal, setProjects } = props;
	const [selectedChain, setSelectedChain] = useState<Chain | NonEVMChain>();
	const [addresses, setAddresses] = useState<IWalletAddress[]>(
		project.addresses || [],
	);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const selectedChainType =
		selectedChain && 'chainType' in selectedChain
			? selectedChain.chainType
			: undefined;

	return (
		<Modal
			headerIcon={<IconWalletOutline32 />}
			headerTitle={formatMessage({
				id: selectedChain
					? 'label.add_new_address'
					: 'label.manage_addresses',
			})}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			backButtonCallback={
				selectedChain ? () => setSelectedChain(undefined) : undefined
			}
		>
			<ModalContainer>
				<Content>
					{selectedChain ? (
						<SublineBold>
							{formatMessage(
								{
									id: 'label.chain_address',
								},
								{
									chainName: getChainName(
										selectedChain.id,
										selectedChainType,
									),
								},
							)}
						</SublineBold>
					) : (
						<>
							<SublineBold>{project.title}</SublineBold>
							<Subline>
								{formatMessage({
									id: 'label.recipient_addresses',
								})}
							</Subline>
						</>
					)}
				</Content>
				{selectedChain ? (
					<AddNewAddress
						project={project}
						selectedChain={selectedChain}
						setProjects={setProjects}
						setSelectedChain={setSelectedChain}
						setAddresses={setAddresses}
					/>
				) : (
					CHAINS.map(chain => (
						<NetworkWalletAddress
							key={chain.name}
							chain={chain}
							addresses={addresses}
							setSelectedChain={setSelectedChain}
						/>
					))
				)}
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	text-align: left;
	padding: 24px;
	${mediaQueries.tablet} {
		width: 556px;
	}
`;

const Content = styled(Flex)`
	gap: 4px;
	padding-bottom: 10px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;
