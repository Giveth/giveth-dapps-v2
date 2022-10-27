import styled from 'styled-components';
import { FC } from 'react';
import Checkbox from '@/components/Checkbox';
import { useNotificationSettingsData } from '@/context/notificationSettings.context';

interface IDappMailCheckbox {
	notificationTypeId: number;
}

const DappMailCheckbox: FC<IDappMailCheckbox> = ({ notificationTypeId }) => {
	const { notificationSettings, setNotificationSettings } =
		useNotificationSettingsData();
	const notificationItem = notificationSettings?.find(
		i => i.notificationTypeId === notificationTypeId,
	);
	const { allowDappPushNotification, allowEmailNotification } =
		notificationItem || {};

	const setEmailNotification = (i: boolean) => {
		setNotificationSettings({
			notificationTypeId,
			allowEmailNotification: i,
		});
	};

	const setDappNotification = (i: boolean) => {
		setNotificationSettings({
			notificationTypeId,
			allowDappPushNotification: i,
		});
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
