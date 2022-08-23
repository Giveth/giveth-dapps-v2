import { GeneralMetatags } from '@/components/Metatag';
import NotificationView from '@/components/views/notification/notification.view';

const NotificationRoute = () => {
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
