import { useEffect, useState } from 'react';
import { CHECK_PURPLE_LIST } from '@/apollo/gql/gqlPurpleList';
import { ICheckPurpleListGQL } from '@/apollo/types/gqlTypes';
import { backendGQLRequest } from '@/helpers/requests';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

export default function usePurpleList() {
	const { walletAddress: address } = useGeneralWallet();

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
