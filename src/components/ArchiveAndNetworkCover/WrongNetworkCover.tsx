import { FC } from 'react';
import { Caption, IconAlertCircle16 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { chainName } from '@/lib/constants/constants';
import { Cover } from './common';
import { Flex } from '../styled-components/Flex';

interface IWrongNetworkCoverProps {
	targetNetwork: number;
}

export const WrongNetworkCover: FC<IWrongNetworkCoverProps> = ({
	targetNetwork,
}) => {
	const { formatMessage } = useIntl();
	const { chainId } = useWeb3React();

	return targetNetwork !== chainId ? (
		<StyledCover>
			<Flex gap='8px'>
				<IconWrapper>
					<IconAlertCircle16 />
				</IconWrapper>
				{chainId !== undefined ? (
					<Content medium>
						{formatMessage(
							{
								id: 'label.wrong_network',
							},
							{
								chainName: chainName(chainId || 0),
								targetChain: chainName(targetNetwork || 0),
							},
						)}
					</Content>
				) : (
					<Content medium>
						{formatMessage({
							id: 'label.please_connect_your_wallet',
						})}
					</Content>
				)}
			</Flex>
		</StyledCover>
	) : null;
};

const StyledCover = styled(Cover)`
	align-items: flex-end;
`;

const IconWrapper = styled.div`
	width: 16px;
	height: 16px;
`;

const Content = styled(Caption)`
	max-width: 320px;
	margin-bottom: 36px;
`;
