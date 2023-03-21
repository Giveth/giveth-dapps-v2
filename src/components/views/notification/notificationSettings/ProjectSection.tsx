import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ItemsWrapper, SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import { GrayBar } from '@/components/views/notification/notification.sc';
import { useNotificationSettingsData } from '@/context/notificationSettings.context';
import { ENotificationCategory } from '@/features/notification/notification.types';

const ProjectSection = () => {
	const [isOpen, setIsOpen] = useState(true);
	const [itemsHeight, setItemsHeight] = useState(0);
	const { formatMessage } = useIntl();

	const { notificationSettings } = useNotificationSettingsData();
	const projectItems = notificationSettings?.filter(
		i =>
			i.notificationType?.category ===
			ENotificationCategory.projectRelated,
	);

	useEffect(() => {
		const resize_ob = new ResizeObserver(function (entries) {
			let rect = entries[0].contentRect;
			setItemsHeight(rect.height);
		});
		resize_ob.observe(document.getElementById('projectWrapperId')!);
		return () => {
			resize_ob.disconnect();
		};
	}, []);

	return (
		<>
			<GrayBar />
			<SectionContainer>
				<SectionHeader
					title={formatMessage({ id: 'label.my_project_activity' })}
					description={formatMessage({
						id: 'label.notifications_for_project_owners_about_project_activity',
					})}
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
				<ItemsWrapper height={itemsHeight} isOpen={isOpen}>
					<div id='projectWrapperId'>
						{projectItems?.map(item => (
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

export default ProjectSection;
