import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import StorageLabel, { setWithExpiry } from '@/lib/localStorage';
import { countReferralClick } from '@/features/user/user.thunks';

export const useReferral = () => {
	const dispatch = useAppDispatch();
	const { userData, isLoading, isSignedIn } = useAppSelector(
		state => state.user,
	);

	const router = useRouter();
	const referrerId = router?.query?.referrer_id;

	useEffect(() => {
		if (referrerId && !isLoading) {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
			} else {
				setWithExpiry(
					StorageLabel.CHAINVINEREFERRED,
					referrerId,
					1 * 24 * 60 * 60,
				);
				if (!userData?.wasReferred && !userData?.isReferrer) {
					dispatch(
						countReferralClick({
							referrerId: referrerId.toString(),
							walletAddress: userData?.walletAddress!,
						}),
					);
				}
			}
		}
	}, [referrerId, isSignedIn, isLoading]);
};
