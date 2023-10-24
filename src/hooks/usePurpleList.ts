import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { CHECK_PURPLE_LIST } from '@/apollo/gql/gqlPurpleList';
import { ICheckPurpleListGQL } from '@/apollo/types/gqlTypes';
import { backendGQLRequest } from '@/helpers/requests';

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
