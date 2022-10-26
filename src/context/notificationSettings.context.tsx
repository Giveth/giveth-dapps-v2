import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { fetchNotificationSettings } from '@/features/notification/notification.services';
import { INotificationSetting } from '@/features/notification/notification.types';
import { showToastError } from '@/lib/helpers';

interface INotificationSettingsContext {
	notificationSettings?: INotificationSetting[];
}

const NotificationSettingsContext =
	createContext<INotificationSettingsContext | null>(null);

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
			.then(res => setNotificationSettings(res.notificationSettings))
			.catch(showToastError);
	}, []);

	console.log('notificationSettings', notificationSettings);

	return (
		<NotificationSettingsContext.Provider value={{ notificationSettings }}>
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
