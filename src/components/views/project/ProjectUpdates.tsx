import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import useUser from '@/context/UserProvider';
import dynamic from 'next/dynamic';
import {
	FETCH_PROJECT_UPDATES,
	ADD_PROJECT_UPDATE,
} from '@/apollo/gql/gqlProjects';
import { Toaster } from 'react-hot-toast';
import { gToast, ToastType } from '@/components/toasts';
import { IFetchProjectUpdates } from '@/apollo/types/gqlTypes';
import ProjectTimeline, { TimelineSection } from './ProjectTimeline';
import { IProject, IProjectUpdate } from '@/apollo/types/types';
import styled from 'styled-components';
import {
	brandColors,
	H5,
	Button,
	neutralColors,
} from '@giveth/ui-design-system';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const UPDATE_LIMIT = 2000;

const ProjectUpdates = (props: { project?: IProject; fetchProject?: any }) => {
	const { id, creationDate, adminUser } = props.project || {};
	const {
		state: { user, isSignedIn },
	} = useUser();
	const [newUpdate, setNewUpdate] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const isOwner = adminUser?.id === user?.id;
	const [addUpdateMutation] = useMutation(ADD_PROJECT_UPDATE);
	const { data } = useQuery(FETCH_PROJECT_UPDATES, {
		variables: {
			projectId: parseInt(id || ''),
			take: 100,
			skip: 0,
		},
	});
	const sortedUpdates = data?.getProjectUpdates;
	const removeUpdate = async () => {};

	const addUpdate = async () => {
		try {
			if (!newUpdate) {
				return gToast('Please add some content to your update', {
					type: ToastType.DANGER,
					// direction: ToastDirection.RIGHT,
					title: 'Empty Updte',
					dismissLabel: 'OK',
					position: 'top-center',
				});
			}
			if (!title) {
				return gToast('Please add a title to your update', {
					type: ToastType.DANGER,
					// direction: ToastDirection.RIGHT,
					title: 'No Empty Title',
					dismissLabel: 'OK',
					position: 'top-center',
				});
			}
			if (newUpdate.length > UPDATE_LIMIT) {
				return gToast(
					`Please add less than ${UPDATE_LIMIT} characters`,
					{
						type: ToastType.DANGER,
						// direction: ToastDirection.RIGHT,
						title: 'Update too long',
						dismissLabel: 'OK',
						position: 'top-center',
					},
				);
			}
			await addUpdateMutation({
				variables: {
					projectId: parseFloat(id!),
					content: newUpdate,
					title: title,
				},
				refetchQueries: [
					{
						query: FETCH_PROJECT_UPDATES,
						variables: {
							projectId: parseFloat(id!),
							take: 100,
							skip: 0,
						},
					},
				],
			});
			setTitle('');
			setNewUpdate(' ');
			props.fetchProject();
			return gToast(`Your update was created`, {
				type: ToastType.SUCCESS,
				// direction: ToastDirection.RIGHT,
				title: 'Success!',
				position: 'top-center',
			});
		} catch (error) {
			console.log({ error });
		}
	};

	return (
		<Wrapper>
			{isOwner && (
				<InputContainer>
					<TimelineSection date='' newUpdate={true} />
					<Content>
						<div>
							<Title>Post an update</Title>
							<Input
								value={title}
								onChange={e => setTitle(e.target.value)}
								placeholder='Type a title...'
							/>
							<RichTextInput
								projectId={id}
								value={newUpdate}
								style={TextInputStyle}
								rows={12}
								autoFocus
								setValue={setNewUpdate}
								withLimit={UPDATE_LIMIT}
								placeholder='Clear project description explaining who your are and what you want to do with the funds...'
							/>
						</div>
						<Button
							buttonType='secondary'
							size='small'
							label='SUBMIT'
							onClick={addUpdate}
						/>
					</Content>
				</InputContainer>
			)}
			{sortedUpdates?.map(
				(i: IProjectUpdate) =>
					i && (
						<ProjectTimeline
							key={i.id}
							projectUpdate={i}
							removeUpdate={removeUpdate}
							isOwner={isOwner}
						/>
					),
			)}
			<ProjectTimeline creationDate={creationDate} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-left: 20px;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 15px;
	margin-bottom: 42px;
	align-items: flex-end;
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

const Input = styled.input`
	padding: 0;
	font-size: 25px;
	line-height: 36px;
	letter-spacing: -0.005em;
	outline: none;
	border: none;
	background: transparent;
	color: ${brandColors.deep[600]};
	width: 100%;
	margin: 30px 0 15px 0;
	::placeholder {
		color: ${neutralColors.gray[600]};
	}
`;

const TextInputStyle = {
	height: '358px',
	marginTop: '4px',
	marginBottom: '100px',
	fontFamily: 'body',
	backgroundColor: 'white',
};

export default ProjectUpdates;
