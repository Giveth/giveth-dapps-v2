import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();

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
					title: formatMessage({ id: 'label.notification_center' }),
					desc: formatMessage({ id: 'label.see_your_notifications' }),
					image: 'https://i.ibb.co/HTbdCdd/Thumbnail.png',
					url: `https://giveth.io/notification`,
				}}
			/>
			<NotificationView />
		</>
	);
};

export default NotificationRoute;
