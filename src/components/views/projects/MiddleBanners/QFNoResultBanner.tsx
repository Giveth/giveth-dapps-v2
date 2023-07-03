import { semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Box, BigArc, Title, Caption } from './common.sc';

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
		</StyledBox>
	);
};

const StyledBox = styled(Box)`
	margin-top: 96px;
	margin-bottom: 96px;
`;
