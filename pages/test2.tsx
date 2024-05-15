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
				<button onClick={() => {}}>Test Button</button>
			</div>
			{failedModalType && (
				<FailedDonation
					txUrl={'0x01121212'}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
		</div>
	);
};

export default YourApp;