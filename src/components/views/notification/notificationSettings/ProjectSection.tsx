import { useEffect, useState } from 'react';
import { ItemsWrapper, SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import { GrayBar } from '@/components/views/notification/notification.sc';

const ProjectSection = () => {
	const [isOpen, setIsOpen] = useState(true);
	const [itemsHeight, setItemsHeight] = useState(0);

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
					title='Project activities'
					description='All notifications related to project activities'
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
				<ItemsWrapper height={itemsHeight} isOpen={isOpen}>
					<div id='projectWrapperId'>
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
		title: 'Project published',
		description: 'When Project has been published',
		notificationTypeId: 8,
	},
	{
		title: 'Project updates',
		description: 'You Posted an update on your project',
		notificationTypeId: 43,
	},
	{
		title: 'Project updates',
		description: 'When your liked project has an update',
		notificationTypeId: 47,
	},
	{
		title: 'Project status',
		description:
			'When your own Project has been listed, unlisted, cancelled, activated or deactivated',
		notificationTypeId: 57,
	},
	{
		title: 'Project status',
		description:
			'When your liked Project has been listed, unlisted, cancelled, activated or deactivated',
		notificationTypeId: 61,
	},
	{
		title: 'Project likes',
		description: 'When someone liked your project',
		notificationTypeId: 46,
	},
	{
		title: 'Donations',
		description:
			'When someone donates to your project, when you \n' +
			'donate to a project, donation success and failure.',
		notificationTypeId: 58,
	},
	{
		title: 'Your boost status',
		description:
			'Shows when you boost a project, change the allocation of \n' +
			'GIVpower.',
		notificationTypeId: 55,
	},
	{
		title: 'Project boost status',
		description: 'Shows when your project receives a boost',
		notificationTypeId: 56,
	},
];

export default ProjectSection;
