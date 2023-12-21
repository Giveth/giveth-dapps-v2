import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { ModifySuperTokenModal } from '@/components/views/donate/ModifySuperToken/ModifySuperTokenModal';
import config from '@/configuration';

const YourApp = () => {
	const [showModal, setShowModal] = useState(false);
	const { address, isConnected, status } = useAccount();
	const { chain } = useNetwork();
	const chainId = chain?.id;

	return (
		<div>
			<w3m-button />
			<div>
				<button
					onClick={() => {
						setShowModal(true);
					}}
				>
					Test Button
				</button>
			</div>
			{showModal && (
				<ModifySuperTokenModal
					setShowModal={setShowModal}
					selectedToken={config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS[1]}
				/>
			)}
		</div>
	);
};

export default YourApp;
