import { useEffect, useState } from 'react';
import { CHECK_PURPLE_LIST } from '@/apollo/gql/gqlPurpleList';
import { ICheckPurpleListGQL } from '@/apollo/types/gqlTypes';
import { backendGQLRequest } from '@/helpers/requests';
import { useAccount } from 'wagmi';

export default function usePurpleList() {
	const { address } = useAccount();

	const [isPurpleList, setIsPurpleList] = useState(false);

	useEffect(() => {
		if (address) {
			backendGQLRequest(CHECK_PURPLE_LIST, { address })
				.then((res: ICheckPurpleListGQL) => {
					setIsPurpleList(res.data?.walletAddressIsPurpleListed);
				})
				.catch(console.log);
		}
	}, [address]);

	return isPurpleList;
}
