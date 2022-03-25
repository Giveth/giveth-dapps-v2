let initialized = false;
let timeDifference: number = 0;
let fetching = false;

export const getNowUnixMS = (): number => {
	if (!initialized && !fetching) {
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

	let now = Date.now();
	now = now - (now % 1000);

	try {
		fetching = true;
		const response = await fetch(
			'https://api.timezonedb.com/v2.1/get-time-zone?by=zone&format=json&key=LU8PKNDD9BUB&zone=GM',
			{ mode: 'no-cors' },
		);

		if (response.ok) {
			const json = await response.json();
			const { timestamp, gmtOffset } = json;
			const unixMS = (timestamp - gmtOffset) * 1000;
			timeDifference = unixMS - now;
			initialized = true;
			window.sessionStorage.setItem(
				'timeDifference',
				String(timeDifference),
			);
		}
	} catch (e) {
		console.error('Error in getting time:', e);
	} finally {
		fetching = false;
	}
};
