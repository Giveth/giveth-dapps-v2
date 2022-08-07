import { IconCheck, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';

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
