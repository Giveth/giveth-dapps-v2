import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ItemsWrapper, SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import { GrayBar } from '@/components/views/notification/notification.sc';
import { useNotificationSettingsData } from '@/context/notificationSettings.context';
import { ENotificationCategory } from '@/features/notification/notification.types';

const GIVeconomySection = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [itemsHeight, setItemsHeight] = useState(0);
	const { formatMessage } = useIntl();

	const { notificationSettings } = useNotificationSettingsData();
	const givEconomyItems = notificationSettings?.filter(
		i => i.notificationType?.category === ENotificationCategory.givEconomy,
	);

	useEffect(() => {
		const resize_ob = new ResizeObserver(function (entries) {
			let rect = entries[0].contentRect;
			setItemsHeight(rect.height);
		});
		resize_ob.observe(document.getElementById('GIVeconomyWrapperId')!);
		return () => {
			resize_ob.disconnect();
		};
	}, []);

	return (
		<>
			<GrayBar />
			<SectionContainer>
				<SectionHeader
					title={formatMessage({ id: 'label.giveconomy_activities' })}
					description={formatMessage({
						id: 'label.all_notifications_related_to_giveconomy',
					})}
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
				<ItemsWrapper height={itemsHeight} isOpen={isOpen}>
					<div id='GIVeconomyWrapperId'>
						{givEconomyItems?.map(item => (
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

export default GIVeconomySection;
