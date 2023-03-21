import {
	neutralColors,
	brandColors,
	Caption,
	Button,
	IconInfoFilled16,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { switchNetwork } from '@/lib/metamask';
import { Flex } from './styled-components/Flex';
import config from '@/configuration';

interface IChangeNetworkModal {
	network: number;
}

export const DAOChangeNetworkModal = ({ network }: IChangeNetworkModal) => {
	const { account, activate } = useWeb3React();
	const networkLabel =
		network === config.XDAI_NETWORK_NUMBER ? 'Gnosis chain' : 'Mainnet';

	const { formatMessage } = useIntl();

	const checkWalletAndSwitchNetwork = async (network: number) => {
		if (!account) {
			await activate(new InjectedConnector({}));
			await switchNetwork(network);
		}
		if (account) {
			await switchNetwork(network);
		}
	};
	return (
		<DAOChangeNetworkModalContainer>
			<Flex gap='16px'>
				<IconInfoFilled16 />
				<Title>{formatMessage({ id: 'label.switch_network' })}</Title>
			</Flex>
			<Desc>
				{formatMessage(
					{ id: 'label.this_regenfarm_is_only_available_on_network' },
					{ networkLabel },
				)}
			</Desc>
			<ChangeButton
				buttonType='texty'
				label={`Switch to ${networkLabel}`}
				onClick={() => checkWalletAndSwitchNetwork(network)}
			/>
		</DAOChangeNetworkModalContainer>
	);
};

const DAOChangeNetworkModalContainer = styled.div`
	background-color: ${neutralColors.gray[100]};
	color: ${brandColors.giv[300]};
	border: 1px solid ${brandColors.giv[300]};
	border-radius: 8px;
	width: 320px;
	z-index: 4;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	opacity: 2;
	padding: 16px;
`;

const Title = styled(Caption)`
	font-weight: bold;
`;

const Desc = styled(Caption)`
	margin-left: 32px;
	margin-bottom: 16px;
`;

const ChangeButton = styled(Button)`
	color: ${brandColors.giv[300]};
	margin-left: auto;
`;
