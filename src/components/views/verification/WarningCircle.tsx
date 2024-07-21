import {
	IconWarning16,
	semanticColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const WarningCircle = () => {
	return (
		<Container>
			<IconWarning16 color='white' size={10} />
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
