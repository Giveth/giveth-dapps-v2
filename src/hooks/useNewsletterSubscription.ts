import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { autopilotClient } from '@/services/autopilot';

function validateEmail(email: string): boolean {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

const useNewsletterSubscription = () => {
	const [email, setEmail] = useState<string>('');
	const [successSubscription, setSuccessSubscription] =
		useState<boolean>(false);

	const error: boolean = !validateEmail(email) && email !== '';

	const submitSubscription = () => {
		autopilotClient
			.post('/contact', {
				contact: {
					Email: email,
					_autopilot_list:
						'contactlist_6C5203EA-9A4E-4868-B5A9-7D943441E9CB',
				},
			})
			.then(() => setSuccessSubscription(true))
			.catch(e => {
				console.log(e.response);
				captureException(e, {
					tags: {
						section: 'submitNewsletterSubscription',
					},
				});
			});
	};
	return {
		submitSubscription,
		successSubscription,
		error,
		setEmail,
		email,
		setSuccessSubscription,
		validateEmail,
	};
};

export default useNewsletterSubscription;
