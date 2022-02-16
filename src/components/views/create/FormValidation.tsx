import { client } from '@/apollo/apolloClient';
import {
	TITLE_IS_VALID,
	WALLET_ADDRESS_IS_VALID,
} from '@/apollo/gql/gqlProjects';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import {
	ECreateErrFields,
	ICreateProjectErrors,
} from '@/components/views/create/CreateIndex';

export const TitleValidation = (
	title: string,
	errors: ICreateProjectErrors,
	setErrors: (arg0: ICreateProjectErrors) => void,
) => {
	const _errors = { ...errors };
	if (title.length < 1) {
		_errors[ECreateErrFields.NAME] = 'Title is required';
		setErrors(_errors);
	} else {
		client
			.query({
				query: TITLE_IS_VALID,
				variables: {
					title,
				},
			})
			.then(() => {
				_errors[ECreateErrFields.NAME] = '';
				setErrors(_errors);
			})
			.catch((err: any) => {
				_errors[ECreateErrFields.NAME] = err.message;
				setErrors(_errors);
			});
	}
};

export const WalletAddressValidation = (
	walletAddress: string,
	web3: any,
	errors: ICreateProjectErrors,
	setErrors: (arg0: ICreateProjectErrors) => void,
	chainId?: number,
) => {
	const _errors = { ...errors };
	let address = walletAddress;

	const queryFunc = () =>
		client
			.query({
				query: WALLET_ADDRESS_IS_VALID,
				variables: {
					address,
				},
			})
			.then(() => {
				_errors[ECreateErrFields.WALLET_ADDRESS] = '';
				setErrors(_errors);
			})
			.catch((err: any) => {
				_errors[ECreateErrFields.WALLET_ADDRESS] = err.message;
				setErrors(_errors);
			});

	if (isAddressENS(walletAddress)) {
		if (chainId !== 1) {
			_errors[ECreateErrFields.WALLET_ADDRESS] =
				'ENS is only supported on Ethereum Mainnet';
			setErrors(_errors);
			return;
		}
		getAddressFromENS(walletAddress, web3).then((addr: string) => {
			if (!addr) {
				_errors[ECreateErrFields.WALLET_ADDRESS] =
					'Invalid ENS address';
				setErrors(_errors);
				return;
			}
			address = addr;
			queryFunc();
		});
	} else if (walletAddress.length !== 42) {
		_errors[ECreateErrFields.WALLET_ADDRESS] = 'Eth address not valid';
		setErrors(_errors);
		return;
	} else {
		queryFunc();
	}
};

export const isDescriptionHeavy = (
	description: string,
	errors: ICreateProjectErrors,
	setErrors: (arg0: ICreateProjectErrors) => void,
) => {
	const _errors = { ...errors };
	const stringSize = encodeURI(description).split(/%..|./).length - 1;
	if (stringSize > 4000000) {
		_errors[ECreateErrFields.DESCRIPTION] = 'Description is too long';
		setErrors(_errors);
	} else {
		_errors[ECreateErrFields.DESCRIPTION] = '';
		setErrors(_errors);
	}
};
