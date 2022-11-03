import { useEffect, useState } from 'react';
import { ItemsWrapper, SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import { GrayBar } from '@/components/views/notification/notification.sc';

const GIVeconomySection = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [itemsHeight, setItemsHeight] = useState(0);

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
					title='GIVeconomy activities'
					description='All notifications related to GIVeconomy'
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
				<ItemsWrapper height={itemsHeight} isOpen={isOpen}>
					<div id='GIVeconomyWrapperId'>
						{itemsArray.map(item => (
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

const itemsArray = [
	{
		title: 'Rewards ',
		description:
			'Shows when you have claimable rewards and \n' +
			'your harvested rewards ',
		notificationTypeId: 60,
	},
	{
		title: 'Stakes',
		description: 'Shows when you stake or unstake on the GIVfarm',
		notificationTypeId: 59,
	},
	{
		title: 'GIVbacks',
		description: 'When GIVbacks are ready to be claimed after each round',
		notificationTypeId: 32,
	},
	{
		title: 'GIVpower Allocations',
		description:
			'Shows your locked, unlocked and received amount of \n' +
			'GIVpower and the amount automatically relocked.',
		notificationTypeId: 54,
	},
];

export default GIVeconomySection;
