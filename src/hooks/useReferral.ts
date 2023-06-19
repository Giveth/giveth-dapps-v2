import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import StorageLabel, { setWithExpiry, getWithExpiry } from '@/lib/localStorage';
import { countReferralClick } from '@/features/user/user.thunks';

export const useReferral = () => {
	const dispatch = useAppDispatch();
	const { userData, isLoading, isSignedIn } = useAppSelector(
		state => state.user,
	);

	const router = useRouter();
	const referrerId = router?.query?.referrer_id;

	useEffect(() => {
		const ref = getWithExpiry(StorageLabel.CHAINVINEREFERRED);
		if (referrerId && !isLoading) {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
			} else {
				if (!userData?.wasReferred && !userData?.isReferrer) {
					if (!ref || ref !== referrerId) {
						setWithExpiry(
							StorageLabel.CHAINVINEREFERRED,
							referrerId,
							1 * 24 * 60 * 60,
						);
					}
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
