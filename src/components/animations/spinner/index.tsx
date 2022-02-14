import React from 'react';
import LottieControl from '../lottieControl';
import Loading from './loading.json';

interface Animation {
	size: number;
}

const Spinner = ({ size }: Animation) => {
	return <LottieControl size={size} animationData={Loading} />;
};

export default Spinner;
