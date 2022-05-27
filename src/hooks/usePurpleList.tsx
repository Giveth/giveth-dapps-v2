import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { CHECK_PURPLE_LIST } from '@/apollo/gql/gqlPurpleList';
import { ICheckPurpleListGQL } from '@/apollo/types/gqlTypes';
import { gqlRequest } from '@/helpers/requests';

export default function usePurpleList() {
	const { account: address } = useWeb3React();

	const [isPurpleList, setIsPurpleList] = useState(false);

	useEffect(() => {
		if (address) {
			gqlRequest(CHECK_PURPLE_LIST, { address })
				.then((res: ICheckPurpleListGQL) => {
					setIsPurpleList(res.data?.walletAddressIsPurpleListed);
				})
				.catch(console.log);
		}
	}, [address]);

	return isPurpleList;
}
