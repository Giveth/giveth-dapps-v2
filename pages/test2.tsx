import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
	PublicKey,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { getTotalGIVpower } from '@/helpers/givpower';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { fetchSubgraphData } from '@/services/subgraph.service';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const { address } = useAccount();
	const subgraphValues = useQueries({
		queries: config.CHAINS_WITH_SUBGRAPH.map(chain => ({
			queryKey: ['subgraph', chain.id, address],
			queryFn: async () => {
				return await fetchSubgraphData(chain.id, address);
			},
			staleTime: config.SUBGRAPH_POLLING_INTERVAL,
		})),
	});

	return (
		<div>
			<button onClick={donateToSolana}>DONATE ON SOLANA</button>
			<w3m-button />
			<div>
				<button
					onClick={() => {
						const totalgivpower = getTotalGIVpower(
							subgraphValues,
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
