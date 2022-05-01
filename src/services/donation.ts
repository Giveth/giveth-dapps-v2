// import transakSDK from '@transak/transak-sdk'
import { SAVE_DONATION } from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { IConfirmDonation } from '@/components/views/donate/helpers';

interface IOnTxHash extends IConfirmDonation {
	txHash: string;
	toAddress: string;
}

export async function saveDonation(props: IOnTxHash) {
	const {
		web3Context,
		toAddress,
		txHash: transactionId,
		amount,
		token,
		project,
		anonymous,
	} = props;

	const { account: fromAddress, chainId } = web3Context;
	const { address: tokenAddress, symbol } = token;
	const projectId = Number(project.id);

	let donationId = 0;
	try {
		const { data } = await client.mutate({
			mutation: SAVE_DONATION,
			variables: {
				chainId,
				fromAddress,
				toAddress,
				transactionId,
				transactionNetworkId: chainId,
				amount,
				token: symbol,
				projectId,
				transakId: null,
				transakStatus: null,
				tokenAddress,
				anonymous,
			},
		});
		const { saveDonation } = data;
		donationId = saveDonation;
	} catch (error) {
		throw error;
	}
	console.log('DONATION SUCCESS: ', { donationId });
	return donationId;
}

export async function saveDonationFromTransak(
	fromAddress: string,
	toAddress: string,
	amount: number,
	token: string,
	projectId: number,
	transakId: string,
	transakStatus: string,
) {
	const saveDonationErrors = [];
	let donationId: any = 0;
	try {
		const { data } = await client.mutate({
			mutation: SAVE_DONATION,
			variables: {
				chainId: 1,
				fromAddress,
				toAddress,
				transactionId: null,
				transactionNetworkId: 1,
				amount,
				token,
				projectId,
				transakId,
				transakStatus,
			},
		});
		const { saveDonation: saveDonationId } = data;
		donationId = saveDonationId;
	} catch (error) {
		console.log({ error });
		saveDonationErrors.push(error);
	}
	return {
		donationId,
		saveDonationErrors,
		savedDonation: saveDonationErrors.length === 0,
	};
}

// export async function startTransakDonation({ project, setSuccess }) {
//   const request = await fetch(`/api/transak`)
//   const response = await request.json()
//   const apiKey = response?.apiKey
//   const transak = new transakSDK({
//     apiKey: apiKey, // Your API Key
//     environment: process.env.NEXT_PUBLIC_ENVIRONMENT == 'live' ? 'PRODUCTION' : 'STAGING', // STAGING/PRODUCTION
//     defaultCryptoCurrency: 'DAI',
//     walletAddress: project.walletAddress, // Your customer's wallet address
//     themeColor: '000000', // App theme color
//     // fiatCurrency: 'USD', // INR/GBP
//     // defaultFiatAmount: amount,
//     cryptoCurrencyList: 'DAI,USDT',
//     email: '', // Your customer's email address
//     redirectURL: '',
//     hostURL: window.location.origin,
//     widgetHeight: '550px',
//     widgetWidth: '450px',
//     exchangeScreenTitle: `Donate to ${project.title}`,
//     hideMenu: true
//   })

//   transak.init()

//   transak.on(transak.ALL_EVENTS, async data => {
//     if (data?.eventName === 'TRANSAK_ORDER_SUCCESSFUL') {
//       transak.close()
//       setSuccess(data.status.walletLink)
//     }
//     if (data?.eventName === 'TRANSAK_ORDER_CREATED') {
//       // data.status
//       await saveDonationFromTransak(
//         data.status.fromWalletAddress,
//         data.status.walletAddress,
//         data.status.cryptoAmount,
//         data.status.cryptoCurrency,
//         parseFloat(project.id),
//         data.status.id,
//         data.status.status
//       )
//     }
//   })
// }
