// import Web3 from 'web3'
// import { GET_PROJECT_BY_ADDRESS } from '../apollo/gql/projects'
// import { GET_USER_BY_ADDRESS } from '../apollo/gql/auth'
import React from 'react';
import { networkInfo } from '@/lib/constants/NetworksObj';
import config from '@/configuration';

const xDaiChainId = 100;
const appNetworkId = config.PRIMARY_NETWORK.id;

export function pollEvery(fn: Function, delay: any) {
	let timer: any = null;
	// having trouble with this type
	let stop = false;
	const poll = async (request: any, onResult: Function) => {
		const result = await request();
		if (!stop) {
			onResult(result);
			timer = setTimeout(poll.bind(null, request, onResult), delay);
		}
	};
	return (...params: any) => {
		const { request, onResult } = fn(...params);
		poll(request, onResult).then();
		return () => {
			stop = true;
			clearTimeout(timer);
		};
	};
}

export function checkNetwork(networkId: number) {
	const isXdai = networkId === xDaiChainId;
	return networkId === appNetworkId || isXdai;
}

export const getImageFile = async (base64Data: any, projectName: any) => {
	const imageFile = await fetch(base64Data)
		.then(res => res.blob())
		.then(blob => {
			return new File([blob], projectName);
		});
	return imageFile;
};

// export async function getEtherscanTxs(address, apolloClient = false, isDonor = false) {
//   try {
//     const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
//     const api = process.env.NEXT_PUBLIC_NETWORK_ID === '3' ? 'api-ropsten' : 'api'
//     const balance = await fetch(
//       `https://${api}.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
//     )
//       .then(response => response.json())
//       .then(data => {
//         return data?.result
//       })

//     return await fetch(
//       `https://${api}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
//     )
//       .then(response => response.json())
//       .then(async data => {
//         const modified = []
//         if (data?.status === '0' || typeof data?.result === 'string') {
//           return {
//             balance,
//             txs: [],
//             error: data?.result
//           }
//         }
//         for (const t of data?.result) {
//           const extra = apolloClient
//             ? await apolloClient?.query({
//                 query: isDonor ? GET_USER_BY_ADDRESS : GET_PROJECT_BY_ADDRESS,
//                 constiables: {
//                   address: isDonor
//                     ? Web3.utils.toChecksumAddress(t?.from)
//                     : Web3.utils.toChecksumAddress(t?.to)
//                 }
//               })
//             : null
//           modified.push({
//             ...t,
//             extra: extra?.data || null,
//             donor: t.from,
//             createdAt: t.timeStamp,
//             currency: 'ETH'
//           })
//         }
//         return {
//           balance,
//           txs: modified
//         }
//       })
//   } catch (error) {
//     console.log({ error })
//   }
// }

export function formatEtherscanLink(type: any, data: any) {
	switch (type) {
		case 'Account': {
			const [chainId, address] = data;
			return `${networkInfo(chainId).networkPrefix}address/${address}`;
		}
		case 'Transaction': {
			const [chainId, hash] = data;
			return `${networkInfo(chainId).networkPrefix}tx/${hash}`;
		}
	}
}
