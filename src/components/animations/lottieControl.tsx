import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

type MyProps = {
	size?: string | number;
	animationData: any;
	speed?: number;
	loop?: boolean;
};

export const LottieControl = ({
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
