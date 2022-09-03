import { B, neutralColors } from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';

export const TableHeader = styled(B)`
	display: flex;
	height: 40px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
	align-items: center;
	${props =>
		props.onClick &&
		css`
			cursor: pointer;
			gap: 8px;
			align-items: center;
		`}
`;

export const RowWrapper = styled.div`
	display: contents;
	& > div:first-child {
		padding-left: 4px;
	}
`;
