import {
	IconWarning32,
	semanticColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const WarningCircle = () => {
	return (
		<Container>
			<IconWarning32 color='white' />
		</Container>
	);
};

const Container = styled(FlexCenter)`
	width: 24px;
	height: 24px;
	border-radius: 50%;
	border: 3px solid ${semanticColors.golden[100]};
	background: ${semanticColors.golden[500]};
	flex-shrink: 0;
`;

export default WarningCircle;
