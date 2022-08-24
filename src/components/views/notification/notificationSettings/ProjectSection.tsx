import { SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';

const ProjectSection = () => {
	return (
		<SectionContainer>
			<SectionHeader
				title='Project activities'
				description='All notifications related to project activities'
			/>
			{itemsArray.map(item => (
				<SectionItem
					title={item.title}
					description={item.description}
					options={<div>hi</div>}
					key={item.title}
				/>
			))}
		</SectionContainer>
	);
};

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
