import { FC } from 'react';
import { Lead } from '@giveth/ui-design-system';
import { SectionSubtitle } from '@/components/views/notification/notificationSettings/common/common.sc';
import { GrayBarTiny } from '@/components/views/notification/notification.sc';

interface ISectionHeader {
	title: string;
	description: string;
}

const SectionHeader: FC<ISectionHeader> = props => {
	const { title, description } = props;
	return (
		<>
			<Lead size='large'>{title}</Lead>
			<SectionSubtitle>{description}</SectionSubtitle>
			<GrayBarTiny />
		</>
	);
};

export default SectionHeader;
