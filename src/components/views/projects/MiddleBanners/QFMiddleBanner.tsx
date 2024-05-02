import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Box, BigArc, Title, Caption } from './common.sc';
import { useProjectsContext } from '@/context/projects.context';

export const QFProjectsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	const { qfRounds } = useProjectsContext();
	const activeRound = qfRounds.find(round => round.isActive);

	return (
		<Box $flexDirection='column' gap='23px'>
			<BigArc color={semanticColors.jade[200]} />
			<Title weight={700} color={semanticColors.jade[700]}>
				{activeRound
					? activeRound.title
					: formatMessage({ id: 'component.qf_middle_banner.title' })}
			</Title>
			<Caption>
				{activeRound
					? activeRound.description
					: formatMessage({ id: 'component.qf_middle_banner.desc' })}
			</Caption>
		</Box>
	);
};
