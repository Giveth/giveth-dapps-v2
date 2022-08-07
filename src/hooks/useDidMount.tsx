import { useRef, useEffect } from 'react';

function useDidMount() {
	const mountRef = useRef(false);
	useEffect(() => {
		mountRef.current = true;
	}, []);
	return mountRef.current;
}

export default useDidMount;
