import React from 'react';
import LottieControl from '../lottieControl';
import ConfettiAnimation from './animation.json';

interface Animation {
	size: number;
}

const Confetti = ({ size }: Animation) => {
	return <LottieControl size={size} animationData={ConfettiAnimation} />;
};

export default Confetti;
