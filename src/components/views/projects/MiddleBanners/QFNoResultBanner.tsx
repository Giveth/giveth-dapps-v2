import { ButtonLink, semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Link from 'next/link';
import { Box, BigArc, Title, Caption } from './common.sc';
import links from '@/lib/constants/links';

export const QFNoResultBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<StyledBox flexDirection='column' gap='24px'>
			<BigArc color={semanticColors.jade[200]} />
			<Title weight={700} color={semanticColors.jade[700]}>
				{formatMessage({
					id: 'label.no_active_qf_round',
				})}
			</Title>
			<Caption>
				{formatMessage({
					id: 'label.support_upcoming_qf_round',
				})}
			</Caption>
			<Link href={links.GIVETH_MATCHING}>
				<DonateButton
					label={formatMessage({
						id: 'label.donate',
					})}
					size='large'
					linkType='primary'
				/>
			</Link>
		</StyledBox>
	);
};

const StyledBox = styled(Box)`
	margin-top: 96px;
	margin-bottom: 96px;
`;

const DonateButton = styled(ButtonLink)`
	max-width: 300px;
`;
