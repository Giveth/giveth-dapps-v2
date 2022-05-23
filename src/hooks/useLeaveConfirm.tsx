import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = {
	shouldConfirm: boolean;
	message?: string;
};

const defaultMessage = 'Are you sure to leave without save?';

const useLeaveConfirm = ({
	shouldConfirm,
	message = defaultMessage,
}: Props) => {
	const Router = useRouter();

	useEffect(() => {
		const onberforeunload = function (event: any) {
			event.returnValue = message;
		};
		const onRouteChangeStart = () => {
			if (shouldConfirm) {
				if (window.confirm(message)) {
					return true;
				}
				Router.events.emit('routeChangeError');
				throw "Abort route change by user's confirmation.";
			}
		};
		if (shouldConfirm) {
			Router.events.on('routeChangeStart', onRouteChangeStart);
			window.addEventListener('beforeunload', onberforeunload);
		}

		return () => {
			window.removeEventListener('beforeunload', onberforeunload);
			Router.events.off('routeChangeStart', onRouteChangeStart);
		};
	}, [Router.events, message, shouldConfirm]);

	return;
};
export default useLeaveConfirm;
