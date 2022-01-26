import React from 'react';
import LottieControl from '../lottieControl';
import ConfettiAnimation from './animation.json';

const Confetti = ({ size }: any) => {
	return <LottieControl size={size} animationData={ConfettiAnimation} />;
};

export default Confetti;
