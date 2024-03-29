import {
	IconCheck,
	semanticColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const CheckCircle = () => {
	return (
		<Container>
			<IconCheck color='white' size={10} />
		</Container>
	);
};

const Container = styled(FlexCenter)`
	width: 24px;
	height: 24px;
	border-radius: 50%;
	border: 3px solid ${semanticColors.jade[100]};
	background: ${semanticColors.jade[500]};
	flex-shrink: 0;
`;

export default CheckCircle;
