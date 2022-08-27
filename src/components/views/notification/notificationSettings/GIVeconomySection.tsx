import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import CheckboxEmailNotification from './common/CheckboxEmailNotification';
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
			resize_ob.unobserve(
				document.getElementById('GIVeconomyWrapperId')!,
			);
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
								key={item.title}
								title={item.title}
								description={item.description}
								options={<CheckboxEmailNotification />}
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
		title: 'Rewards ',
		description:
			'Shows when you have claimable rewards and \n' +
			'your harvested rewards ',
	},
	{
		title: 'Stakes',
		description: 'Shows when you stake or unstake on the GIVfarm',
	},
	{
		title: 'Farm',
		description:
			'When a new farm has been added to the platform\n' +
			'or disabled. ',
	},
	{
		title: 'GIVbacks',
		description:
			'When GIVbacks are ready to be claimed after each\n' + 'round',
	},
	{
		title: 'GIVpower Allocations',
		description:
			'Shows the your locked, unlocked ,received amount of \n' +
			'GIVpower and the amount automatically relocked.',
	},
];

export default GIVeconomySection;
