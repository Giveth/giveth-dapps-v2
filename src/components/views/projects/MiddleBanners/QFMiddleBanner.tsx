import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Box, BigArc, Title, Caption } from './common.sc';
import { useAppSelector } from '@/features/hooks';
import { useProjectsContext } from '@/context/projects.context';

export const QFProjectsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);
	const { archivedQFRound } = useProjectsContext();
	const round = archivedQFRound || activeQFRound;

	return (
		<Box $flexDirection='column' gap='23px'>
			<BigArc color={semanticColors.jade[200]} />
			<Title weight={700} color={semanticColors.jade[700]}>
				{round && round.title
					? round.title
					: formatMessage({ id: 'component.qf_middle_banner.title' })}
			</Title>
			<Caption>
				{round && round.description
					? round.description
					: formatMessage({ id: 'component.qf_middle_banner.desc' })}
			</Caption>
		</Box>
	);
};
