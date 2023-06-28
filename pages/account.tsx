import Head from 'next/head';
import { useAppSelector } from '@/features/hooks';
import { useReferral } from '@/hooks/useReferral';
import Spinner from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import UserProfileView from '@/components/views/userProfile/UserProfile.view';

const UserRoute = () => {
	const { isSignedIn, isEnabled, userData, isLoading } = useAppSelector(
		state => state.user,
	);
	useReferral();

	if (isLoading) {
		return <Spinner />;
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
			<UserProfileView user={userData!} myAccount />
		</>
	);
};

export default UserRoute;
