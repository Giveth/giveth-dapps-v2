import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import {
	Box,
	BigArc,
	Title,
	Caption,
} from '@/components/views/projects/MiddleBanners/common.sc';
import { useAppSelector } from '@/features/hooks';
import { useCausesContext } from '@/context/causes.context';

export const CauseQFMiddleBanner = () => {
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);
	const { archivedQFRound } = useCausesContext();
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
