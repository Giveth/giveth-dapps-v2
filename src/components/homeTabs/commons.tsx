import { brandColors, Container, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';

export const TabContainer = styled.div``;

export const TopContainer = styled(TabContainer)`
	background-image: url('/images/backgrounds/givup.svg');
	height: 370px;
`;

export const TopInnerContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	height: 370px;
`;
export const TopContainerRow = styled(Row)``;
export const TopFiller = styled.div`
	flex: 1;
`;

export const ExtLinkRow = styled(Row)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
	gap: 4px;
	:hover {
		color: ${brandColors.cyan[300]};
	}
`;

export const ExtLink = styled(GLink)``;
