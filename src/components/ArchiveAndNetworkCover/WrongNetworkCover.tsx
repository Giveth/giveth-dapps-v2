import { FC } from 'react';
import { Caption, IconAlertCircle16 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { chainName } from '@/lib/constants/constants';
import { Cover } from './common';

interface IWrongNetworkCoverProps {
	targetNetwork: number;
}

export const WrongNetworkCover: FC<IWrongNetworkCoverProps> = ({
	targetNetwork,
}) => {
	const { formatMessage } = useIntl();
	const { chainId } = useWeb3React();

	return targetNetwork !== chainId ? (
		<Cover>
			<IconWrapper>
				<IconAlertCircle16 />
			</IconWrapper>
			{chainId !== undefined ? (
				<Content medium>
					{formatMessage({
						id: 'label.you_are_currently_connected_to',
					})}{' '}
					{chainName(chainId || 0)}{' '}
					{formatMessage({ id: 'label.switch_to' })}{' '}
					{chainName(targetNetwork || 0)}{' '}
					{formatMessage({
						id: 'label.to_interact_with_this_farm',
					})}
				</Content>
			) : (
				<Content medium>
					{formatMessage({
						id: 'label.please_connect_your_wallet',
					})}
				</Content>
			)}
		</Cover>
	) : null;
};

const IconWrapper = styled.div`
	width: 16px;
	height: 16px;
`;

const Content = styled(Caption)`
	max-width: 320px;
`;
