import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, BigArc, Title, Caption } from './common.sc';
import { useProjectsContext } from '@/context/projects.context';

export const QFProjectsMiddleBanner = () => {
	const router = useRouter();
	const { formatMessage } = useIntl();

	const { qfRounds, isArchivedQF } = useProjectsContext();
	const round = qfRounds.find(round => {
		if (isArchivedQF) return round.slug === router.query.slug;
		else return round.isActive;
	});

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
