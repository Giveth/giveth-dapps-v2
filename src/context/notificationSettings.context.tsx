import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	fetchNotificationSettings,
	INotificationSettingsPostInput,
	postNotificationSettings,
} from '@/features/notification/notification.services';
import { INotificationSetting } from '@/features/notification/notification.types';
import { showToastError } from '@/lib/helpers';

interface IChangeableItems {
	allowEmailNotification?: boolean;
	allowDappPushNotification?: boolean;
}

interface INotificationSettingsContext {
	notificationSettings?: INotificationSetting[];
	setNotificationSettings: (i: INotificationSettingsPostInput) => void;
}

const NotificationSettingsContext = createContext<INotificationSettingsContext>(
	{
		setNotificationSettings: async () => null,
	},
);

NotificationSettingsContext.displayName = 'NotificationSettingsContext';

interface IProviderProps {
	children: ReactNode;
}

export const NotificationSettingsProvider: FC<IProviderProps> = props => {
	const { children } = props;
	const [notificationSettings, setNotificationSettings] =
		useState<INotificationSetting[]>();

	useEffect(() => {
		fetchNotificationSettings()
			.then(res => setNotificationSettings(res?.notificationSettings))
			.catch(showToastError);
	}, []);

	const handleSet = (inputObj: INotificationSettingsPostInput) => {
		const {
			notificationTypeId,
			allowDappPushNotification,
			allowEmailNotification,
		} = inputObj;
		const newItem: IChangeableItems = {};
		if (allowDappPushNotification !== undefined) {
			newItem['allowDappPushNotification'] = allowDappPushNotification;
		}
		if (allowEmailNotification !== undefined) {
			newItem['allowEmailNotification'] = allowEmailNotification;
		}
		const newSettingsItems = notificationSettings?.map(i => {
			if (i.notificationTypeId === notificationTypeId) {
				return { ...i, ...newItem };
			}
			return i;
		});
		setNotificationSettings(newSettingsItems);
		postNotificationSettings(inputObj).catch(showToastError);
	};

	return (
		<NotificationSettingsContext.Provider
			value={{
				notificationSettings,
				setNotificationSettings: handleSet,
			}}
		>
			{children}
		</NotificationSettingsContext.Provider>
	);
};

export const useNotificationSettingsData = () => {
	const context = useContext(NotificationSettingsContext);
	if (context === undefined) {
		throw new Error(
			'useNotificationSettingsData must be used within a Provider',
		);
	}
	return context;
};
