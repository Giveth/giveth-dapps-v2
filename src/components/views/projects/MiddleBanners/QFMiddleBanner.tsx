import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Box, BigArc, Title, Caption } from './common.sc';

export const QFProjectsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<Box flexDirection='column' gap='23px'>
			<BigArc color={semanticColors.jade[200]} />
			<Title weight={700} color={semanticColors.jade[700]}>
				{formatMessage({
					id: 'component.qf_middle_banner.title',
				})}
			</Title>
			<Caption>
				{formatMessage({
					id: 'component.qf_middle_banner.desc',
				})}
			</Caption>
		</Box>
	);
};
