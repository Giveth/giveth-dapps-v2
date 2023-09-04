import { useEffect, useState } from 'react';

const useDelay = (show: boolean, delay?: number) => {
	const [delayedShow, setDelayedShow] = useState(show);

	useEffect(() => {
		setTimeout(() => {
			setDelayedShow(show);
		}, delay || 300);
	}, [show]);

	return delayedShow;
};

export default useDelay;
