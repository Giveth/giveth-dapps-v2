// import dynamic from 'next/dynamic';
import Lottie from 'react-lottie';

// const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

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
	const defaultOptions = {
		loop,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<div>
			<Lottie
				options={defaultOptions}
				height={size}
				width={size}
				isStopped={false}
				isPaused={false}
				isClickToPauseDisabled={true}
				speed={speed}
			/>
		</div>
	);
};

export default LottieControl;
