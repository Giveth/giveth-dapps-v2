import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import Checkbox from '@/components/Checkbox';
import { useNotificationSettingsData } from '@/context/notificationSettings.context';
import { INotificationSetting } from '@/features/notification/notification.types';

interface IDappMailCheckbox {
	notificationItem: INotificationSetting;
}

const DappMailCheckbox: FC<IDappMailCheckbox> = ({ notificationItem }) => {
	const { setNotificationSettings } = useNotificationSettingsData();
	const { formatMessage } = useIntl();
	const {
		id,
		allowDappPushNotification,
		allowEmailNotification,
		notificationType,
	} = notificationItem;
	const { isEmailEditable, isWebEditable } = notificationType || {};

	const setEmailNotification = (i: boolean) => {
		setNotificationSettings({ id, allowEmailNotification: i });
	};

	const setDappNotification = (i: boolean) => {
		setNotificationSettings({ id, allowDappPushNotification: i });
	};

	return (
		<Container>
			<Checkbox
				label={formatMessage({ id: 'label.send_me_an_email' })}
				checked={allowEmailNotification}
				onChange={setEmailNotification}
				disabled={!isEmailEditable}
				size={18}
			/>
			<Checkbox
				label={formatMessage({ id: 'label.notify_me_in_the_dapp' })}
				checked={allowDappPushNotification}
				onChange={setDappNotification}
				disabled={!isWebEditable}
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
