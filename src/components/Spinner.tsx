import styled from 'styled-components';
import LottieControl from '@/components/LottieControl';
import { FlexCenter } from '@/components/styled-components/Flex';
import LoadingAnimation from '@/animations/loading_giv.json';

export default function Spinner() {
	return (
		<Container>
			<LottieControl animationData={LoadingAnimation} size={300} />
		</Container>
	);
}

const Container = styled(FlexCenter)`
	min-height: 700px;
`;
