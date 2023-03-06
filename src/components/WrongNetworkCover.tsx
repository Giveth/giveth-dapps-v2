import { FC } from 'react';
import {
	Caption,
	brandColors,
	IconAlertCircle16,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { chainName } from '@/lib/constants/constants';
import { FlexCenter } from './styled-components/Flex';

interface IWrongNetworkCoverProps {
	targetNetwork: number;
}

export const WrongNetworkCover: FC<IWrongNetworkCoverProps> = ({
	targetNetwork,
}) => {
	const { formatMessage } = useIntl();
	const { chainId } = useWeb3React();

	return targetNetwork !== chainId ? (
		<WrongNetworkContainer>
			<IconWrapper>
				<IconAlertCircle16 />
			</IconWrapper>
			<Caption medium>
				{formatMessage({
					id: 'label.you_are_currently_connected_to',
				})}{' '}
				{chainName(chainId || 0)}{' '}
				{formatMessage({ id: 'label.switch_to' })}{' '}
				{chainName(targetNetwork || 0)}{' '}
				{formatMessage({
					id: 'label.to_interact_with_this_farm',
				})}
			</Caption>
		</WrongNetworkContainer>
	) : null;
};

const WrongNetworkContainer = styled(FlexCenter)`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24px;
	background: ${brandColors.giv[900]}dd;
	z-index: 2;
	gap: 16px;
`;

const IconWrapper = styled.div`
	width: 16px;
	height: 16px;
`;
