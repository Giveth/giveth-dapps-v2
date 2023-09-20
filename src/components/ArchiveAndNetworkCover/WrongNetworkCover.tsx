import { FC } from 'react';
import { Caption, IconAlertCircle16 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useChainId } from 'wagmi';
import { Cover } from './common';
import { Flex } from '../styled-components/Flex';
import { chainNameById } from '@/lib/network';

interface IWrongNetworkCoverProps {
	targetNetwork: number;
}

export const WrongNetworkCover: FC<IWrongNetworkCoverProps> = ({
	targetNetwork,
}) => {
	const { formatMessage } = useIntl();

	const chainId = useChainId();

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
								chainName: chainNameById(chainId || 0),
								targetChain: chainNameById(targetNetwork || 0),
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
