import Head from 'next/head';
import { useAppSelector } from '@/features/hooks';
import Spinner from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';

const UserRoute = () => {
	const { isSignedIn, isEnabled, userData, isLoading } = useAppSelector(
		state => state.user,
	);

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
			<UserPublicProfileView user={userData!} myAccount />
		</>
	);
};

export default UserRoute;
