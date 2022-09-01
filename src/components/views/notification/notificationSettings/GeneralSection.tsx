import { SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import ToggleReceiveNotifications from '@/components/views/notification/notificationSettings/common/ToggleReceiveNotifications';
import { GrayBar } from '@/components/views/notification/notification.sc';

const GeneralSection = () => {
	return (
		<>
			<GrayBar />
			<SectionContainer>
				<SectionHeader
					title='General'
					description='Modify all settings all at once'
				/>
				<SectionItem
					title='Email notifications'
					description='Turn on/off all email notifications'
					options={<ToggleReceiveNotifications />}
				/>
				<SectionItem
					title='Dapp notifications'
					description='Turn on/off all Dapp notifications'
					options={<ToggleReceiveNotifications />}
				/>
			</SectionContainer>
		</>
	);
};

export default GeneralSection;
