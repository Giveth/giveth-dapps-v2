import { useState } from 'react';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();

	return (
		<div>
			<w3m-button />
			<div>
				<button
					onClick={() => {
						setFailedModalType(EDonationFailedType.NOT_SAVED);
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
