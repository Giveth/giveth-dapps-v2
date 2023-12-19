import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import createProfileABI from '@/artifacts/createProfile.json';
import config from '@/configuration';
import { IProject } from '@/apollo/types/types';

interface ICreateAnchorContract {
	project: IProject;
}

const useCreateAnchorContract = ({ project }: ICreateAnchorContract) => {
	const {
		slug,
		adminUser: { walletAddress },
		id,
	} = project;
	const { config: contractConfig } = usePrepareContractWrite({
		address: config.OPTIMISM_CONFIG.anchorRegistryAddress,
		functionName: 'createProfile',
		abi: createProfileABI.abi,
		chainId: config.OPTIMISM_NETWORK_NUMBER,
		args: [
			+id!,
			slug,
			{
				protocol: 1,
				pointer: '',
			},
			walletAddress,
			[],
		],
	});

	const contractWrite = useContractWrite(contractConfig);

	return { ...contractWrite };
};

export default useCreateAnchorContract;
