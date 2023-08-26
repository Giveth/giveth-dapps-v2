import {
	IconWalletOutline32,
	neutralColors,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IProject, IWalletAddress } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import { NetworkWalletAddress } from './NetworkWalletAddress';
import { networksParams } from '@/helpers/blockchain';
import { AddNewAddress } from './AddNewAddress';
import type { IModal } from '@/types/common';

const networksConfig = config.NETWORKS_CONFIG;
const networkIds = Object.keys(networksConfig).map(Number);

interface IManageProjectAddressesModal extends IModal {
	project: IProject;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

export const ManageProjectAddressesModal: FC<IManageProjectAddressesModal> = ({
	project,
	setShowModal,
	setProjects,
}) => {
	const [selectedWallet, setSelectedWallet] = useState<IWalletAddress>();
	const [addresses, setAddresses] = useState<IWalletAddress[]>([]);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	useEffect(() => {
		const WalletAddr: { [key: number]: IWalletAddress } = {};
		networkIds.forEach(networkId => {
			WalletAddr[networkId] = { networkId };
		});
		const { addresses } = project;
		if (!addresses) return;
		for (let i = 0; i < addresses.length; i++) {
			const address = addresses[i];
			if (address.networkId) {
				WalletAddr[address.networkId] = address;
			}
		}
		setAddresses(Object.values(WalletAddr));
	}, [project]);

	return (
		<Modal
			headerIcon={<IconWalletOutline32 />}
			headerTitle={formatMessage({
				id: selectedWallet
					? 'label.add_new_address'
					: 'label.manage_addresses',
			})}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			backButtonCallback={
				selectedWallet ? () => setSelectedWallet(undefined) : undefined
			}
		>
			<ModalContainer>
				<Content>
					{selectedWallet ? (
						<SublineBold>
							{formatMessage(
								{
									id: 'label.chain_address',
								},
								{
									chainName: selectedWallet.networkId
										? networksParams[
												selectedWallet.networkId
										  ].chainName
										: '',
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
				{selectedWallet ? (
					<AddNewAddress
						project={project}
						selectedWallet={selectedWallet}
						setProjects={setProjects}
						setSelectedWallet={setSelectedWallet}
						setAddresses={setAddresses}
					/>
				) : (
					addresses.map((addr, index) => (
						<NetworkWalletAddress
							key={index}
							networkWallet={addr}
							setSelectedWallet={setSelectedWallet}
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
