import styled from 'styled-components';
import { neutralColors, GLink } from '@giveth/ui-design-system';

export const InputContainer = styled.div`
	margin: 24px 0 64px 0;
	color: ${neutralColors.gray[900]};
`;

export const Label = styled(GLink)`
	height: 18px;
	margin: 4px 0 0 0;
`;

export const TinyLabel = styled(GLink)`
	margin: 4px 0 0 0;
	color: ${neutralColors.gray[900]};
`;
