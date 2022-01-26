import React from 'react';
import LottieControl from '../lottieControl';
import Loading from './loading.json';

const Spinner = ({ size }: any) => {
	return <LottieControl size={size} animationData={Loading} />;
};

export default Spinner;
