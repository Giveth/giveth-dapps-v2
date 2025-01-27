import { captureException } from '@sentry/nextjs';

let initialized = false;
let timeDifference = 0;
let fetching = false;

export const getNowUnixMS = (): number => {
	if (!initialized && !fetching && typeof window !== 'undefined') {
		fetchServerTime();
	}
	return Date.now() + timeDifference;
};

const fetchServerTime = async () => {
	const stored = window.sessionStorage.getItem('timeDifference');
	if (stored) {
		timeDifference = Number(stored);
		initialized = true;
		return;
	}

	const startTime = Date.now();

	try {
		fetching = true;
		const response = await fetch(`/api/time`, {
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
		});

		if (response.ok) {
			const json = await response.json();
			const { unixTime } = json;
			timeDifference = Math.floor(
				(unixTime - startTime + unixTime - Date.now()) / 2,
			);
			initialized = true;
			window.sessionStorage.setItem(
				'timeDifference',
				String(timeDifference),
			);
		}
	} catch (e) {
		console.error('Error in getting time:', e);
		captureException(e, {
			tags: {
				section: 'fetcherServerTime',
			},
		});
	} finally {
		fetching = false;
	}
};
