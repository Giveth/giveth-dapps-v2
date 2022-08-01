import { useEffect, useState } from 'react';

function useMediaQuery(query: string): boolean | null {
	const [matches, setMatches] = useState<boolean | null>(null);

	//Calling these two functions only in useEffect for preventing hydration mismatch issue
	const getMatches = (query: string): boolean => {
		return window.matchMedia(query).matches;
	};

	function handleChange() {
		setMatches(getMatches(query));
	}

	useEffect(() => {
		const matchMedia = window.matchMedia(query);

		// Triggered at the first client-side load and if query changes
		handleChange();

		// Listen matchMedia
		if (matchMedia.addListener) {
			matchMedia.addListener(handleChange);
		} else {
			matchMedia.addEventListener('change', handleChange);
		}

		return () => {
			if (matchMedia.removeListener) {
				matchMedia.removeListener(handleChange);
			} else {
				matchMedia.removeEventListener('change', handleChange);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return matches;
}

export default useMediaQuery;
