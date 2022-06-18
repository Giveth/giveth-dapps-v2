import { useState } from 'react';

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
		setTimeout(() => {
			setSuccessSubscription(true);
		}, 0);
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
