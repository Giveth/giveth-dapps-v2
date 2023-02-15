import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { LottieRefCurrentProps } from 'lottie-react';
import styled from 'styled-components';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type MyProps = {
	size?: number;
	animationData: any;
	speed?: number;
	loop?: boolean;
};

const LottieControl = ({
	size = 400,
	animationData,
	speed = 1,
	loop = true,
}: MyProps) => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (lottieRef.current && speed !== 1) {
			lottieRef.current.setSpeed(speed);
		}
	}, [speed]);

	return (
		<LottieContainer>
			<Lottie
				lottieRef={lottieRef}
				animationData={animationData}
				loop={loop}
				style={{ width: size, height: size }}
			/>
		</LottieContainer>
	);
};

const LottieContainer = styled.div`
	width: fit-content;
	margin: 0 auto;
`;

export default LottieControl;
