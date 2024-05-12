import { Container, semanticColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	BigArc,
	Box,
	Title,
	Caption,
} from '../projects/MiddleBanners/common.sc';

export const ArchivedQFRoundsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<Box $flexDirection='column' gap='23px'>
			<StyledBigArc color={semanticColors.jade[200]} />
			<Container>
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
			</Container>
		</Box>
	);
};

const StyledBigArc = styled(BigArc)`
	left: -125%;
`;
