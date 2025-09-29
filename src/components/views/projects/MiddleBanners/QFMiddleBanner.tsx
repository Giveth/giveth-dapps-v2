import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Box, BigArc, Title, Caption } from './common.sc';
import { useProjectsContext } from '@/context/projects.context';
import { IQFRound } from '@/apollo/types/types';

interface IQFProjectsMiddleBannerProps {
	qfRound?: IQFRound | null;
}

export const QFProjectsMiddleBanner = ({
	qfRound,
}: IQFProjectsMiddleBannerProps) => {
	const { formatMessage } = useIntl();
	const { archivedQFRound } = useProjectsContext();
	const round = archivedQFRound || qfRound;

	if (!round) return null;

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
