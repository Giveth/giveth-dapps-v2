import { FC } from 'react';
import { Caption, Flex, IconAlertCircle16 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { Cover } from './common';
import { getChainName } from '@/lib/network';

interface IWrongNetworkCoverProps {
	targetNetwork: number;
}

export const WrongNetworkCover: FC<IWrongNetworkCoverProps> = ({
	targetNetwork,
}) => {
	const { formatMessage } = useIntl();

	const { chain } = useAccount();
	const chainId = chain?.id;

	return targetNetwork !== chainId ? (
		<StyledCover>
			<Flex gap='8px'>
				<IconWrapper>
					<IconAlertCircle16 />
				</IconWrapper>
				{chainId !== undefined ? (
					<Content $medium>
						{formatMessage(
							{
								id: 'label.wrong_network',
							},
							{
								chainName: getChainName(chainId || 0),
								targetChain: getChainName(targetNetwork || 0),
							},
						)}
					</Content>
				) : (
					<Content $medium>
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
	align-items: flex-end !important;
`;

const IconWrapper = styled.div`
	width: 16px;
	height: 16px;
`;

const Content = styled(Caption)`
	max-width: 320px;
	margin-bottom: 36px;
`;
