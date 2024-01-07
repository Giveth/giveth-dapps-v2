import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconBackward24,
	IconNetwork32,
	Lead,
	neutralColors,
	ButtonText,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { mediaQueries } from '@/lib/constants/constants';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { INetworkIdWithChain } from '@/components/views/donate/common.types';
import config from '@/configuration';
import NetworkLogo from '../NetworkLogo';
import { NetworkItem, SelectedNetwork } from './SwitchNetwork';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { Flex, FlexCenter } from '../styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { ChainType } from '@/types/config';
import { signOut } from '@/features/user/user.thunks';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

interface IDonateWrongNetwork extends IModal {
	acceptedChains?: INetworkIdWithChain[];
}

const networks = [
	config.MAINNET_CONFIG,
	config.GNOSIS_CONFIG,
	config.POLYGON_CONFIG,
	config.CELO_CONFIG,
	config.OPTIMISM_CONFIG,
	config.CLASSIC_CONFIG,
	config.SOLANA_CONFIG,
];

export const DonateWrongNetwork: FC<IDonateWrongNetwork> = props => {
	const { setShowModal, acceptedChains } = props;
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const theme = useAppSelector(state => state.general.theme);
	const router = useRouter();
	const { switchNetwork } = useSwitchNetwork();
	const { setVisible } = useWalletModal();
	const dispatch = useAppDispatch();
	const { disconnect } = useGeneralWallet();

	const { slug } = router.query;

	const eligibleNetworks = networks.filter(
		network =>
			acceptedChains?.some(
				acceptedChain => acceptedChain.networkId === network.id,
			),
	);

	useEffect(() => {
		if (
			chainId &&
			acceptedChains?.some(
				acceptedChain => acceptedChain.networkId === chainId,
			)
		) {
			closeModal();
		}
	}, [chainId, acceptedChains]);

	const handleSignOutAndSignInWithSolana = async () => {
		await dispatch(signOut());
		disconnect();
		setVisible(true);
		closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: 'label.switch_network' })}
			headerIcon={<IconNetwork32 />}
			hiddenClose
			headerTitlePosition='left'
		>
			<CustomHr margin='24px' />
			<ModalContainer>
				<Lead>
					{formatMessage({
						id: 'label.sorry_this_projet_doesnt_support_your_current_net',
					})}
				</Lead>
				<br />
				<Lead>
					{formatMessage({ id: 'label.please_switch_your_network' })}
				</Lead>
				<br />
				<CustomFlex>
					{eligibleNetworks.map(network => {
						const _chainId = network.id;
						return (
							<NetworkItem
								onClick={() => {
									if (
										network.chainType === ChainType.SOLANA
									) {
										handleSignOutAndSignInWithSolana();
									} else {
										switchNetwork?.(_chainId);
										closeModal();
									}
								}}
								isSelected={_chainId === chainId}
								key={_chainId}
								theme={theme}
							>
								<NetworkLogo
									chainId={_chainId}
									logoSize={32}
									chainType={network.chainType}
								/>
								<B>{network.name}</B>
								{_chainId === chainId && (
									<SelectedNetwork
										styleType='Small'
										theme={theme}
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
				<br />
				<CustomHr margin='0' />
				<FlexCenter direction='column'>
					<FooterText>{formatMessage({ id: 'label.or' })}</FooterText>
					<Link href={`${Routes.Project}/${slug}`}>
						<Flex gap='12px' alignItems='center'>
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

const CustomHr = styled.hr<{ margin: string }>`
	margin-left: ${props => props.margin};
	margin-right: ${props => props.margin};
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
