import { brandColors, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { Flex } from '../styled-components/Flex';

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
export const TopContainerRow = styled(Flex)``;
export const BottomContainer = styled.div`
	margin-top: 32px;
`;
export const TopFiller = styled.div`
	flex: 1;
`;

export const ExtLinkRow = styled(Flex)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
	gap: 4px;
	:hover {
		color: ${brandColors.cyan[300]};
	}
`;

export const ExtLink = styled(GLink)``;
