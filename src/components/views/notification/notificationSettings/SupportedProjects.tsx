import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNotificationSettingsData } from '@/context/notificationSettings.context';
import { ENotificationCategory } from '@/features/notification/notification.types';
import { GrayBar } from '@/components/views/notification/notification.sc';
import {
	ItemsWrapper,
	SectionContainer,
} from '@/components/views/notification/notificationSettings/common/common.sc';
import SectionHeader from '@/components/views/notification/notificationSettings/common/SectionHeader';
import { SectionItem } from '@/components/views/notification/notificationSettings/common/SectionItem';

const SupportedProjects = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [itemsHeight, setItemsHeight] = useState(0);
	const { formatMessage } = useIntl();

	const { notificationSettings } = useNotificationSettingsData();
	const supportedProjects = notificationSettings?.filter(
		i =>
			i.notificationType?.category ===
			ENotificationCategory.supportedProjects,
	);

	useEffect(() => {
		const resize_ob = new ResizeObserver(function (entries) {
			let rect = entries[0].contentRect;
			setItemsHeight(rect.height);
		});
		resize_ob.observe(
			document.getElementById('supportedProjectsWrapperId')!,
		);
		return () => {
			resize_ob.disconnect();
		};
	}, []);

	return (
		<>
			<GrayBar />
			<SectionContainer>
				<SectionHeader
					title={formatMessage({
						id: 'label.supported_project_activity',
					})}
					description={formatMessage({
						id: 'label.notifications_related_to_projects_you_liked_donated_boosted',
					})}
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
				<ItemsWrapper height={itemsHeight} isOpen={isOpen}>
					<div id='supportedProjectsWrapperId'>
						{supportedProjects?.map(item => (
							<SectionItem
								key={item.notificationTypeId}
								item={item}
							/>
						))}
					</div>
				</ItemsWrapper>
			</SectionContainer>
		</>
	);
};

export default SupportedProjects;
