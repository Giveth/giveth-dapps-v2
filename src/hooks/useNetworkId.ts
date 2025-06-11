import { useAccount } from 'wagmi';

export const useNetworkId = () => {
	const { chain } = useAccount();
	return chain?.id;
};