import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import createProfileABI from '@/artifacts/createProfile.json';
import config from '@/configuration';
import { IAdminUser } from '@/apollo/types/types';

interface ICreateAnchorContract {
	slug?: string;
	adminUser?: IAdminUser;
	id?: string;
}

// Custom hook for creating an anchor contract
const useCreateAnchorContract = ({
	slug,
	adminUser,
	id,
}: ICreateAnchorContract) => {
	const { walletAddress } = adminUser || {};

	// Prepare the contract configuration using usePrepareContractWrite hook
	const { config: contractConfig } = usePrepareContractWrite({
		address: config.OPTIMISM_CONFIG.anchorRegistryAddress,
		functionName: 'createProfile',
		abi: createProfileABI.abi,
		chainId: config.OPTIMISM_NETWORK_NUMBER,
		args: [
			+id!, // Convert id to a number
			slug,
			{
				protocol: 1,
				pointer: '',
			},
			walletAddress,
			[],
		],
	});

	// Use the useContractWrite hook to perform the contract write operation
	const contractWrite = useContractWrite(contractConfig);

	// Return the contract write result
	return { ...contractWrite };
};

export default useCreateAnchorContract;
