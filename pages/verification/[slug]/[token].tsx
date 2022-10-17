import React, { useEffect } from 'react';

import { setShowFooter } from '@/features/general/general.slice';
import EmailVerificationIndex from '@/components/views/verification/EmailVerificationIndex';
import { useAppDispatch } from '@/features/hooks';

export default function Token() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, []);

	return <EmailVerificationIndex />;
}
