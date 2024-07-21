import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { getTotalGIVpower } from '@/helpers/givpower';
import { formatWeiHelper } from '@/helpers/number';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const queryClient = useQueryClient();
	const { address } = useAccount();

	return (
		<div>
			<w3m-button />
			<div>
				<button
					onClick={() => {
						const totalgivpower = getTotalGIVpower(
							queryClient,
							address,
						);
						console.log(
							'totalgivpower',
							formatWeiHelper(totalgivpower.total),
						);
					}}
				>
					Test Button
				</button>
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
