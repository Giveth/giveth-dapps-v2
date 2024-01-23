import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { SENTRY_URGENT } from '@/configuration';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();

	return (
		<div>
			<w3m-button />
			<div>
				<button
					onClick={() => {
						try {
							throw new Error('oopppssss');
						} catch (error) {
							captureException(error, {
								tags: {
									section: SENTRY_URGENT,
								},
							});
						}
					}}
				>
					Test Button1
				</button>
			</div>
			{failedModalType && (
				<FailedDonation
					txUrl={'0x011212'}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
		</div>
	);
};

export default YourApp;
