import styled from 'styled-components';
import { neutralColors, GLink, brandColors } from '@giveth/ui-design-system';
import { Regular_Input } from '@/components/styled-components/Input';

export const InputContainer = styled.div`
	margin: 24px 0 64px 0;
	color: ${neutralColors.gray[900]};
`;

export const Label = styled(GLink)`
	height: 18px;
	margin: 4px 0 0 0;
`;

export const TinyLabel = styled(GLink)`
	height: 14px;
	margin: 4px 0 0 0;
	color: ${neutralColors.gray[600]};
`;

export const InputErrorMessage = styled.div`
	color: ${brandColors.pinky[500]};
	font-size: 12px;
	margin-top: 5px;
`;

export const InputWithError = styled(Regular_Input)<{ error: boolean }>`
	border-color: ${props => props.error && brandColors.pinky[500]};
`;
