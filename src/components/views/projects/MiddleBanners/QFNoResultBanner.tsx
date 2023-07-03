import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Box, BigArc, Title, Caption } from './common.sc';

export const QFNoResultBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<Box flexDirection='column' gap='24px'>
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
		</Box>
	);
};
