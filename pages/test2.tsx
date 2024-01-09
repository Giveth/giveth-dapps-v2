import { erc20ABI, useAccount, useContractRead, useNetwork } from 'wagmi';
import { useState } from 'react';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const { address, isConnected, status } = useAccount();
	const { chain } = useNetwork();
	const chainId = chain?.id;
	// console.log('address', address, isConnected, status, chainId);
	const { data } = useContractRead({
		address: '0xc916Ce4025Cb479d9BA9D798A80094a449667F5D',
		abi: erc20ABI,
		functionName: 'allowance',
	});

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
