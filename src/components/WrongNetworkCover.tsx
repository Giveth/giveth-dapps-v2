import { FC } from 'react';
import {
	IconAlertCircle32,
	Caption,
	brandColors,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { chainName } from '@/lib/constants/constants';
import { Flex } from './styled-components/Flex';

interface IWrongNetworkCoverProps {
	poolNetwork: number;
}

export const WrongNetworkCover: FC<IWrongNetworkCoverProps> = ({
	poolNetwork,
}) => {
	const { formatMessage } = useIntl();
	const { chainId } = useWeb3React();

	return poolNetwork !== chainId ? (
		<WrongNetworkContainer>
			<IconAlertCircle32 />
			<Caption>
				{formatMessage({
					id: 'label.you_are_currently_connected_to',
				})}{' '}
				{chainName(chainId || 0)}{' '}
				{formatMessage({ id: 'label.switch_to' })}{' '}
				{chainName(poolNetwork || 0)}{' '}
				{formatMessage({
					id: 'label.to_interact_with_this_farm',
				})}
			</Caption>
		</WrongNetworkContainer>
	) : null;
};

const WrongNetworkContainer = styled(Flex)`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24px;
	flex-direction: row;
	align-items: center;
	background: ${brandColors.giv[900]}dd;
	z-index: 2;
	div {
		padding: 0 0 0 17px;
	}
`;
