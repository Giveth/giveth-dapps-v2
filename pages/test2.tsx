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
				<button onClick={() => {}}>Test Button1</button>
			</div>
			{failedModalType && (
				<FailedDonation
					txUrl={'0x0112121'}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
		</div>
	);
};

export default YourApp;
