import { useAccount } from 'wagmi';
import { Framework, SuperToken__factory } from '@superfluid-finance/sdk-core';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';
import { FETCH_USER_STREAMS_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { getEthersProvider } from '@/helpers/ethers';
import { IProjectStreamsData, IStream } from '@/types/superFluid';

export interface IStreamWithBalance extends IStream {
	balance: BigNumber;
}

export const useProjectClaimableDonations = () => {
	//Optimism address
	const { address } = useAccount();
	const [isLoading, setIsLoading] = useState(false); // Add isLoading state
	const [streams, setStreams] = useState<IStreamWithBalance[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!address) return;

			setIsLoading(true); // Set isLoading to true when fetching data

			try {
				const { data }: { data: IProjectStreamsData } =
					await fetchUserStreams(address);
				if (data && data.streams) {
					const sf = await initializeSuperFluid();
					const streamsWithBalances = await getStreamsBalances(
						sf,
						data.streams,
						address,
					);
					setStreams(streamsWithBalances);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false); // Set isLoading to false when data fetching is complete
			}
		};

		fetchData();
	}, [address]);

	const fetchUserStreams = async (userAddress: string) => {
		return gqlRequest(
			config.OPTIMISM_CONFIG.superFluidSubgraph,
			undefined,
			FETCH_USER_STREAMS_BY_ADDRESS,
			{ address: userAddress.toLowerCase() },
		);
	};

	const initializeSuperFluid = async () => {
		const _provider = getEthersProvider({
			chainId: config.OPTIMISM_CONFIG.id,
		});
		return await Framework.create({
			chainId: config.OPTIMISM_CONFIG.id,
			provider: _provider,
		});
	};

	const getStreamsBalances = async (
		sf: Framework,
		streams: IStream[],
		userAddress: string,
	) => {
		const balances = await Promise.all(
			streams.map(async stream => {
				return {
					...stream,
					balance: await calculateStreamBalance(
						sf,
						stream,
						userAddress,
					),
				};
			}),
		);
		return balances;
	};

	const calculateStreamBalance = async (
		sf: Framework,
		stream: IStream,
		userAddress: string,
	) => {
		const superTokenContract = SuperToken__factory.connect(
			stream.token.id,
			sf.settings.provider,
		);
		const [realtimeBalanceOfNowResult] = await Promise.all([
			superTokenContract.realtimeBalanceOfNow(userAddress),
			sf.cfaV1.getNetFlow({
				superToken: stream.token.id,
				account: userAddress,
				providerOrSigner: sf.settings.provider,
			}),
		]);
		return realtimeBalanceOfNowResult?.availableBalance;
	};

	return { isLoading, streams };
};
