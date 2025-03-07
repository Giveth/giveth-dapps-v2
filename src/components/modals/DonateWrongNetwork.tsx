import React, { FC, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconBackward24,
	IconNetwork32,
	Lead,
	P,
	neutralColors,
	ButtonText,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSwitchChain } from 'wagmi';
import { Chain } from 'viem';
import { mediaQueries } from '@/lib/constants/constants';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { INetworkIdWithChain } from '@/components/views/donate/common/common.types';
import config from '@/configuration';
import NetworkLogo from '../NetworkLogo';
import { NetworkItem, SelectedNetwork } from './SwitchNetwork';
import { useAppSelector } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';
import { ChainType } from '@/types/config';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import {
	DonateModalPriorityValues,
	useDonateData,
} from '@/context/donate.context';

interface IDonateWrongNetwork extends IModal {
	acceptedChains?: INetworkIdWithChain[];
}

const networks = [
	config.MAINNET_CONFIG,
	config.GNOSIS_CONFIG,
	config.POLYGON_CONFIG,
	config.CELO_CONFIG,
	config.ARBITRUM_CONFIG,
	config.OPTIMISM_CONFIG,
	config.CLASSIC_CONFIG,
	config.SOLANA_CONFIG,
	config.BASE_CONFIG,
	config.ZKEVM_CONFIG,
	config.STELLAR_CONFIG,
];

export const DonateWrongNetwork: FC<IDonateWrongNetwork> = props => {
	const { setShowModal, acceptedChains } = props;
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const theme = useAppSelector(state => state.general.theme);
	const router = useRouter();
	const { switchChain } = useSwitchChain();
	const isSafeEnv = useIsSafeEnvironment();
	const { setDonateModalByPriority } = useDonateData();
	const closeNetworkModal = useCallback(() => {
		setDonateModalByPriority(DonateModalPriorityValues.None);
		closeModal();
	}, []);

	const {
		walletChainType,
		handleSingOutAndSignInWithEVM,
		handleSignOutAndSignInWithSolana,
		chain,
		chainName,
	} = useGeneralWallet();

	const { slug } = router.query;
	const eligibleNetworks = networks.filter(network =>
		acceptedChains?.some(acceptedChain =>
			acceptedChain.chainType === ChainType.SOLANA
				? acceptedChain.chainType === network.chainType
				: acceptedChain.networkId === network.id,
		),
	);

	const networkId = (chain as Chain)?.id;

	useEffect(() => {
		if (
			networkId &&
			acceptedChains?.some(
				acceptedChain => acceptedChain.networkId === networkId,
			)
		) {
			closeNetworkModal();
		}
	}, [networkId, acceptedChains]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: 'label.switch_network' })}
			headerIcon={<IconNetwork32 />}
			hiddenClose
			headerTitlePosition='left'
		>
			<CustomHr $margin='24px' />
			<ModalContainer>
				<Lead>
					{formatMessage(
						{
							id: isSafeEnv
								? 'label.this_projet_doesnt_receive_donations_on'
								: 'label.sorry_this_projet_doesnt_support_your_current_net',
						},
						{ chainName },
					)}
				</Lead>
				<br />
				{isSafeEnv ? (
					<>
						<P>
							{formatMessage(
								{
									id: 'label.this_project_only_accepts_donations_on',
								},
								{
									chainName: eligibleNetworks
										.map(network => network.name)
										.join(', '),
								},
							)}
						</P>
						<P>
							{formatMessage({
								id: 'label.connect_to_giveth_from_a_multisig',
							})}
						</P>
					</>
				) : (
					<>
						<Lead>
							{formatMessage({
								id: 'label.please_switch_your_network',
							})}
						</Lead>
						<br />
						<CustomFlex>
							{eligibleNetworks.map(network => {
								const _chainId = network.id;
								return (
									<NetworkItem
										onClick={async () => {
											if (
												network.chainType ===
													ChainType.SOLANA &&
												walletChainType ===
													ChainType.EVM
											) {
												await handleSignOutAndSignInWithSolana();
												closeModal();
											} else if (
												network.chainType ===
													ChainType.EVM &&
												walletChainType ===
													ChainType.SOLANA
											) {
												await handleSingOutAndSignInWithEVM();
											} else {
												switchChain?.({
													chainId: _chainId,
												});
											}
										}}
										$isSelected={_chainId === networkId}
										key={_chainId}
										$baseTheme={theme}
									>
										<NetworkLogo
											chainId={_chainId}
											logoSize={32}
											chainType={network.chainType}
										/>
										<B>{network.name}</B>
										{_chainId === networkId && (
											<SelectedNetwork
												$styleType='Small'
												$baseTheme={theme}
											>
												{formatMessage({
													id: 'label.selected',
												})}
											</SelectedNetwork>
										)}
									</NetworkItem>
								);
							})}
						</CustomFlex>
					</>
				)}
				<br />
				<CustomHr $margin='0' />
				<FlexCenter direction='column'>
					<FooterText>{formatMessage({ id: 'label.or' })}</FooterText>
					<Link href={`${Routes.Project}/${slug}`}>
						<Flex gap='12px' $alignItems='center'>
							<IconBackward24 color={brandColors.giv[500]} />
							<BackButton>
								{formatMessage({
									id: 'label.go_back_to_project_details',
								})}
							</BackButton>
						</Flex>
					</Link>
				</FlexCenter>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 32px 24px;
	text-align: left;
	${mediaQueries.laptopS} {
		min-width: 866px;
	}
`;

const CustomHr = styled.hr<{ $margin: string }>`
	margin-left: ${props => props.$margin};
	margin-right: ${props => props.$margin};
	border: 1px solid ${neutralColors.gray[400]};
`;

const FooterText = styled(Lead)`
	color: ${neutralColors.gray[700]};
	margin: 16px 0;
`;

const BackButton = styled(ButtonText)`
	color: ${brandColors.giv[500]};
`;

const CustomFlex = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	${mediaQueries.laptopS} {
		flex-direction: row;
		gap: 60px;
	}
`;
