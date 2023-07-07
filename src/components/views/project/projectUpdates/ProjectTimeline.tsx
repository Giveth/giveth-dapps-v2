import { FC } from 'react';
import { IProjectUpdate } from '@/apollo/types/types';
import LaunchSection from '@/components/views/project/projectUpdates/LaunchSection';
import UpdatesSection from '@/components/views/project/projectUpdates/UpdatesSection';

interface IProps {
	projectUpdate?: IProjectUpdate;
	creationDate?: string;
	removeUpdate?: Function;
	editUpdate?: Function;
	isOwner?: boolean;
}

const ProjectTimeline: FC<IProps> = props => {
	const { projectUpdate, creationDate, removeUpdate, editUpdate, isOwner } =
		props;
	if (creationDate) return <LaunchSection creationDate={creationDate} />;
	else if (projectUpdate)
		return (
			<UpdatesSection
				projectUpdate={projectUpdate}
				removeUpdate={removeUpdate}
				editUpdate={editUpdate}
				isOwner={isOwner}
			/>
		);
	else return null;
};

export default ProjectTimeline;
