import {
	Flex,
	GLink,
	IconExternalLink16,
	brandColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { ChainType } from '@/types/config';
import { formatTxLink } from '@/lib/helpers';
import config from '@/configuration';

interface ITXLinkProps {
	tx: string;
}

export const TXLink: FC<ITXLinkProps> = ({ tx }) => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper gap='8px' $alignItems='center' $justifyContent='center'>
			<GLink
				as='a'
				href={formatTxLink({
					txHash: tx,
					chainType: ChainType.EVM,
					networkId: config.OPTIMISM_NETWORK_NUMBER,
				})}
				target='_blank'
				rel='noreferrer'
			>
				{formatMessage({ id: 'label.view_on_block_explorer' })}
			</GLink>
			<IconExternalLink16 />
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	color: ${brandColors.pinky[500]};
	:hover {
		color: ${brandColors.pinky[700]};
	}
`;
