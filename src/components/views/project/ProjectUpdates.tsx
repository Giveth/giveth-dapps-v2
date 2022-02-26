import { useState } from 'react';
import { useQuery } from '@apollo/client';
import useUser from '@/context/UserProvider';
import dynamic from 'next/dynamic';
import { FETCH_PROJECT_UPDATES } from '@/apollo/gql/gqlProjects';
import { IFetchProjectUpdates } from '@/apollo/types/gqlTypes';
import ProjectTimeline, { TimelineSection } from './ProjectTimeline';
import { IProject, IProjectUpdate } from '@/apollo/types/types';
import styled from 'styled-components';
import { brandColors, H5 } from '@giveth/ui-design-system';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const ProjectUpdates = (props: { project?: IProject }) => {
	const { id, creationDate, adminUser } = props.project || {};
	const {
		state: { user, isSignedIn },
	} = useUser();
	const [newUpdate, setNewUpdate] = useState(null);
	const isOwner = adminUser?.id === user?.id;
	const { data } = useQuery(FETCH_PROJECT_UPDATES, {
		variables: { projectId: parseInt(id || ''), take: 100, skip: 0 },
	});
	const updates = data?.getProjectUpdates;

	const sortedUpdates = updates
		?.map((i: IFetchProjectUpdates) => i.projectUpdate)
		.sort((a: IProjectUpdate, b: IProjectUpdate) => {
			return (
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime()
			);
		});

	return (
		<Wrapper>
			{isOwner && (
				<InputContainer>
					<TimelineSection date='' newUpdate={true} />
					<Content>
						<Title>Post an update</Title>
						<RichTextInput
							style={TextInputStyle}
							rows={12}
							autoFocus
							onChange={setNewUpdate}
						/>
					</Content>
				</InputContainer>
			)}
			{sortedUpdates?.map(
				(i: IProjectUpdate) =>
					i && <ProjectTimeline key={i.id} projectUpdate={i} />,
			)}
			<ProjectTimeline creationDate={creationDate} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-left: 20px;
`;

const Content = styled.div`
	margin-top: 15px;
	margin-bottom: 42px;
`;

const Title = styled(H5)`
	color: ${brandColors.deep[600]};
	font-weight: 400;
	margin-bottom: 16px;
	margin-left: 30px;
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const TextInputStyle = {
	height: '349px',
	marginTop: '4px',
	marginBottom: '100px',
	fontFamily: 'body',
	paddingLeft: '20px',
};

export default ProjectUpdates;
