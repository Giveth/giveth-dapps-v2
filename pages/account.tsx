import Head from 'next/head';
import { useAppSelector } from '@/features/hooks';
import { useReferral } from '@/hooks/useReferral';
import { WrappedSpinner } from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import UserProfileView from '@/components/views/userProfile/UserProfile.view';
import { ProfileProvider } from '@/context/profile.context';

const AccountRoute = () => {
	const { isSignedIn, isEnabled, userData, isLoading } = useAppSelector(
		state => state.user,
	);
	useReferral();

	if (isLoading) {
		return <WrappedSpinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	}

	return (
		<>
			<Head>
				<title>{userData?.name} | Giveth</title>
			</Head>
			<ProfileProvider user={userData!} myAccount>
				<UserProfileView />
			</ProfileProvider>
		</>
	);
};

export default AccountRoute;
