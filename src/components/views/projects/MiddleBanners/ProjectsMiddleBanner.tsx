import { brandColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Box, BigArc, Title, Caption } from './common.sc';

export const ProjectsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<Box flexDirection='column' gap='23px'>
			<BigArc color={brandColors.giv[100]} />
			<Title weight={700} color={brandColors.giv[500]}>
				{formatMessage({
					id: 'page.projects.middle.donate_directly',
				})}
			</Title>
			<Caption>
				{formatMessage({
					id: 'page.home.bigscreen.get_rewarded',
				})}
			</Caption>
		</Box>
	);
};
