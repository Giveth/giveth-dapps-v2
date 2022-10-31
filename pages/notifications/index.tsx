import { GeneralMetatags } from '@/components/Metatag';
import Spinner from '@/components/Spinner';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import NotificationView from '@/components/views/notification/notification.view';
import WalletNotConnected from '@/components/WalletNotConnected';
import { useAppSelector } from '@/features/hooks';

const NotificationRoute = () => {
	const { isSignedIn, isEnabled, isLoading } = useAppSelector(
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
			<GeneralMetatags
				info={{
					title: 'Notification Center',
					desc: 'See tour notifications',
					image: 'https://i.ibb.co/HTbdCdd/Thumbnail.png',
					url: `https://giveth.io/notification`,
				}}
			/>
			<NotificationView />
		</>
	);
};

export default NotificationRoute;
