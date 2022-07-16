import { captureException } from '@sentry/nextjs';
import { client } from '@/apollo/apolloClient';
import { WALLET_ADDRESS_IS_VALID } from '@/apollo/gql/gqlProjects';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import {
	ECreateErrFields,
	ICreateProjectErrors,
} from '@/components/views/create/CreateProject';
import config from '@/configuration';

export const walletAddressValidation = (
	walletAddress: string,
	web3: any,
	errors: ICreateProjectErrors,
	setErrors: (arg0: ICreateProjectErrors) => void,
	chainId?: number,
	networkId?: number,
) => {
	const _errors = { ...errors };
	let address = walletAddress;
	const isMain = networkId === config.PRIMARY_NETWORK.id;
	const errorField = isMain
		? ECreateErrFields.MAIN_WALLET_ADDRESS
		: ECreateErrFields.SECONDARY_WALLET_ADDRESS;

	const queryFunc = () =>
		client
			.query({
				query: WALLET_ADDRESS_IS_VALID,
				variables: {
					address,
				},
			})
			.then(() => {
				_errors[errorField] = '';
				setErrors(_errors);
			})
			.catch((err: any) => {
				_errors[errorField] = err.message;
				setErrors(_errors);

				captureException(err, {
					tags: {
						section: 'walletAddressValidation',
					},
				});
			});

	if (isAddressENS(walletAddress)) {
		if (networkId !== config.PRIMARY_NETWORK.id) {
			_errors[errorField] = 'ENS is only supported on Ethereum Mainnet';
			setErrors(_errors);
			return;
		}
		if (chainId !== 1) {
			_errors[errorField] =
				'Please switch to the Ethereum Mainnet to handle ENS';
			setErrors(_errors);
			return;
		}
		getAddressFromENS(walletAddress, web3).then((addr: string) => {
			if (!addr) {
				_errors[errorField] = 'Invalid ENS address';
				setErrors(_errors);
				return;
			}
			address = addr;
			queryFunc();
		});
	} else if (walletAddress.length !== 42) {
		_errors[errorField] = 'Eth address not valid';
		setErrors(_errors);
		return;
	} else {
		queryFunc();
	}
};

export const isDescriptionHeavy = (description: string) => {
	const stringSize = encodeURI(description).split(/%..|./).length - 1;
	if (stringSize > 4000000) {
		return 'Description is too long';
	} else {
		return true;
	}
};
