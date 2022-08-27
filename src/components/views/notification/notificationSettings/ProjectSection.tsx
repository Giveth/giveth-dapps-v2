import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import CheckboxEmailNotification from './common/CheckboxEmailNotification';
import { GrayBar } from '@/components/views/notification/notification.sc';

const ProjectSection = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [itemsHeight, setItemsHeight] = useState(0);

	useEffect(() => {
		const resize_ob = new ResizeObserver(function (entries) {
			let rect = entries[0].contentRect;
			setItemsHeight(rect.height);
		});
		resize_ob.observe(document.getElementById('projectWrapperId')!);
		return () => {
			resize_ob.unobserve(document.getElementById('projectWrapperId')!);
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
								title={item.title}
								description={item.description}
								options={<CheckboxEmailNotification />}
								key={item.title}
							/>
						))}
					</div>
				</ItemsWrapper>
			</SectionContainer>
		</>
	);
};

const ItemsWrapper = styled.div<{ isOpen: boolean; height: number }>`
	height: ${({ isOpen, height }) => (isOpen ? height + 'px' : 0)};
	transition: height 1s ease-in-out;
	overflow: hidden;
`;

const itemsArray = [
	{
		title: 'Project Saved',
		description: 'When Project is saved as draft',
	},
	{
		title: 'Project Published',
		description: 'When Project has been published',
	},
	{
		title: 'Project Updates',
		description: 'You Posted an update on your project',
	},
	{
		title: 'Project  status',
		description:
			'When Project has been listed, unlisted, cancelled, activated or deactivated',
	},
	{
		title: 'Form  status',
		description:
			'When Form has been sent and under review, rejected or approved',
	},
	{
		title: 'Project likes',
		description: 'When someone liked your project',
	},
	{
		title: 'Comments',
		description: 'When someone writes a comment on your project',
	},
	{
		title: 'Donations',
		description:
			'When someone donates to your project, when you \n' +
			'donate to a project, donation success and failure.',
	},
	{
		title: 'Verification',
		description:
			'Your Project Verification Status, reminders to approve\n' +
			'for verification.',
	},
	{
		title: 'Your boost status',
		description:
			'Shows when you boost a project, change the allocation of \n' +
			'GIVpower.',
	},
	{
		title: 'Project boost status',
		description: 'Shows when your project receives a boost',
	},
];

export default ProjectSection;
