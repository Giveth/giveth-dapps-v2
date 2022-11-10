import styled from 'styled-components';
import { FC } from 'react';
import Checkbox from '@/components/Checkbox';
import { useNotificationSettingsData } from '@/context/notificationSettings.context';
import { INotificationSetting } from '@/features/notification/notification.types';

interface IDappMailCheckbox {
	notificationItem: INotificationSetting;
}

const DappMailCheckbox: FC<IDappMailCheckbox> = ({ notificationItem }) => {
	const { setNotificationSettings } = useNotificationSettingsData();
	const { id, allowDappPushNotification, allowEmailNotification } =
		notificationItem;

	const setEmailNotification = (i: boolean) => {
		setNotificationSettings({ id, allowEmailNotification: i });
	};

	const setDappNotification = (i: boolean) => {
		setNotificationSettings({ id, allowDappPushNotification: i });
	};

	return (
		<Container>
			<Checkbox
				label='Send me email'
				checked={allowEmailNotification}
				onChange={setEmailNotification}
				size={18}
			/>
			<Checkbox
				label='Dapp notification'
				checked={allowDappPushNotification}
				onChange={setDappNotification}
				size={18}
			/>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	gap: 16px;
	flex-direction: column;
`;

export default DappMailCheckbox;
