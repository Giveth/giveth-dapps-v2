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
	INotificationSettingsPutInput,
	putNotificationSettings,
} from '@/features/notification/notification.services';
import { INotificationSetting } from '@/features/notification/notification.types';
import { showToastError } from '@/lib/helpers';

interface INotificationSettingsContext {
	notificationSettings?: INotificationSetting[];
	setNotificationSettings: (i: INotificationSettingsPutInput) => void;
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

	const handleSet = (inputObj: INotificationSettingsPutInput) => {
		const { id, allowDappPushNotification, allowEmailNotification } =
			inputObj;
		let newItem: INotificationSettingsPutInput = { id };
		if (allowDappPushNotification !== undefined) {
			newItem['allowDappPushNotification'] = allowDappPushNotification;
		}
		if (allowEmailNotification !== undefined) {
			newItem['allowEmailNotification'] = allowEmailNotification;
		}
		const newSettingsItems = notificationSettings?.map(i => {
			if (i.id === id) {
				const { allowDappPushNotification, allowEmailNotification } = i;
				newItem = {
					allowDappPushNotification,
					allowEmailNotification,
					...newItem,
				};
				return { ...i, ...newItem };
			}
			return i;
		});
		const oldSettingsItems = structuredClone(notificationSettings);
		setNotificationSettings(newSettingsItems);
		putNotificationSettings(newItem)
			.then(res => {
				// Check if items are written to the database, change them back if not
				if (
					res.allowDappPushNotification !==
						newItem.allowDappPushNotification ||
					res.allowEmailNotification !==
						newItem.allowEmailNotification
				) {
					const _newSettingsItems = newSettingsItems?.map(i => {
						if (i.id === res.id) {
							return { ...i, ...res };
						}
						return i;
					});
					setNotificationSettings(_newSettingsItems);
				}
			})
			.catch(() => {
				setNotificationSettings(oldSettingsItems);
			});
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
