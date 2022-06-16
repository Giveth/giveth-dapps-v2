import LottieControl from '@/components/animations/lottieControl';
import { FlexCenter } from '@/components/styled-components/Flex';
import LoadingAnimation from '@/animations/loading_giv.json';

export default function LoadingVerification() {
	return (
		<FlexCenter>
			<LottieControl animationData={LoadingAnimation} size={150} />
		</FlexCenter>
	);
}
