import styled from 'styled-components';
import { neutralColors, Flex } from '@giveth/ui-design-system';

export const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 24px;
`;

export const ModifyWrapper = styled.div`
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	background: ${neutralColors.gray[100]};
	padding: 16px;
`;
