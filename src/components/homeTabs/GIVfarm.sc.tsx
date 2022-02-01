import styled from 'styled-components';

import {
	D1,
	H1,
	H2,
	H3,
	P,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
} from '@giveth/ui-design-system';
import { TopContainer } from './commons';
import { RewardCard } from '../RewardCard';
import { Row } from '../styled-components/Grid';

export const GIVfarmTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;

export const Left = styled.div`
	width: 708px;
`;

export const Right = styled.div`
	align-self: end;
`;

export const Title = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 89px;
`;

export const GIVfarmRewardCard = styled(RewardCard)``;

interface PoolRowProps {
	disabled?: boolean;
}

export const PoolRow = styled(Row)<PoolRowProps>`
	margin: 24px 0;
	opacity: ${props => (props.disabled ? '0.2' : '1')};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

export const ContractRow = styled(Row)`
	gap: 8px;
`;

export const CopyWrapper = styled.div`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
	:hover {
		color: ${brandColors.cyan[300]};
	}
`;
