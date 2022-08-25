import { useState } from 'react';
import { SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';
import CheckboxEmailNotification from '@/components/views/notification/notificationSettings/common/CheckboxEmailNotification';

const GIVeconomySection = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<SectionContainer>
			<SectionHeader
				title='GIVeconomy activities'
				description='All notifications related to GIVeconomy'
				isOpen={isOpen}
				onClick={() => setIsOpen(!isOpen)}
			/>
			{isOpen &&
				itemsArray.map(item => (
					<SectionItem
						title={item.title}
						description={item.description}
						options={<CheckboxEmailNotification />}
						key={item.title}
					/>
				))}
		</SectionContainer>
	);
};

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
