import { B, neutralColors, P } from '@giveth/ui-design-system';
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

export const TableCell = styled(P)`
	display: flex;
	align-items: center;
	overflow-x: auto;
	gap: 8px;
`;

export const TableFooter = styled(B)`
	display: flex;
	padding: 18px 0;
	border-top: 1px solid ${neutralColors.gray[400]};
	align-items: center;
`;
