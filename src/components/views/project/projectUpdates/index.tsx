import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import {
	brandColors,
	H5,
	Button,
	neutralColors,
} from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';

import {
	FETCH_PROJECT_UPDATES,
	ADD_PROJECT_UPDATE,
	DELETE_PROJECT_UPDATE,
	EDIT_PROJECT_UPDATE,
} from '@/apollo/gql/gqlProjects';
import { showToastError } from '@/lib/helpers';
import { gToast, ToastType } from '@/components/toasts';
import { IProjectUpdate } from '@/apollo/types/types';
import { RemoveUpdateModal } from '@/components/modals/RemoveUpdateModal';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useProjectContext } from '@/context/project.context';
import ProjectTimeline from '@/components/views/project/projectUpdates/ProjectTimeline';
import TimelineSection from '@/components/views/project/projectUpdates/TimelineSection';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const UPDATE_LIMIT = 2000;

const ProjectUpdates = () => {
	const { projectData, fetchProjectBySlug } = useProjectContext();
	const { id, creationDate, adminUser } = projectData || {};

	const dispatch = useAppDispatch();
	const { isSignedIn, userData: user } = useAppSelector(state => state.user);

	const [newUpdate, setNewUpdate] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [currentUpdate, setCurrentUpdate] = useState<string>('');
	const [showRemoveUpdateModal, setShowRemoveUpdateModal] = useState(false);
	const [isLimitExceeded, setIsLimitExceeded] = useState(false);

	const [addUpdateMutation] = useMutation(ADD_PROJECT_UPDATE);
	const [deleteUpdateMutation] = useMutation(DELETE_PROJECT_UPDATE);
	const [editUpdateMutation] = useMutation(EDIT_PROJECT_UPDATE);

	const { data } = useQuery(FETCH_PROJECT_UPDATES, {
		variables: {
			projectId: parseInt(id || ''),
			take: 100,
			skip: 0,
		},
	});

	const sortedUpdates = data?.getProjectUpdates;
	const isOwner = adminUser?.id === user?.id;

	const editUpdate = async (
		title: string,
		content: string,
		updateId: string,
	) => {
		try {
			await editUpdateMutation({
				variables: {
					title,
					content,
					updateId: parseFloat(updateId!),
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
			fetchProjectBySlug();
			gToast(`Your updates are saved`, {
				type: ToastType.SUCCESS,
				// direction: ToastDirection.RIGHT,
				title: 'Success!',
				position: 'top-center',
			});
			return true;
		} catch (error: any) {
			console.log({ error });
			captureException(error, {
				tags: {
					section: 'editProjectUpdate',
				},
			});
			return gToast(error?.message, {
				type: ToastType.DANGER,
				// direction: ToastDirection.RIGHT,
				title: 'Error',
				dismissLabel: 'OK',
				position: 'top-center',
			});
		}
	};

	const removeUpdate = async (updateId: string) => {
		try {
			await deleteUpdateMutation({
				variables: {
					updateId: parseFloat(updateId!),
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
			fetchProjectBySlug();
			gToast(`Your update was deleted`, {
				type: ToastType.SUCCESS,
				title: 'Success!',
				position: 'top-center',
			});
			return true;
		} catch (error: any) {
			showToastError(error);
			captureException(error, {
				tags: {
					section: 'removeProjectUpdate',
				},
			});
		}
	};

	const addUpdate = async () => {
		try {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			if (!newUpdate) {
				return gToast('Please add some content to your update', {
					type: ToastType.DANGER,
					title: 'Empty Update',
					dismissLabel: 'OK',
					position: 'top-center',
				});
			}
			if (!title) {
				return gToast('Please add a title to your update', {
					type: ToastType.DANGER,
					title: 'No Empty Title',
					dismissLabel: 'OK',
					position: 'top-center',
				});
			}
			if (isLimitExceeded) {
				return gToast(
					`Please enter less than ${UPDATE_LIMIT} characters`,
					{
						type: ToastType.DANGER,
						title: 'Update too long',
						dismissLabel: 'OK',
						position: 'top-center',
					},
				);
			}
			setTitle('');
			setNewUpdate(' ');
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
			fetchProjectBySlug();
			return gToast(`Your update was created`, {
				type: ToastType.SUCCESS,
				title: 'Success!',
				position: 'top-center',
			});
		} catch (error: any) {
			captureException(error, {
				tags: {
					section: 'addProjectUpdate',
				},
			});
			return showToastError(error);
		}
	};

	return (
		<Wrapper>
			{showRemoveUpdateModal && (
				<RemoveUpdateModal
					setShowModal={setShowRemoveUpdateModal}
					callback={async () => {
						await removeUpdate(currentUpdate);
						setShowRemoveUpdateModal(false);
					}}
				/>
			)}
			{isOwner && (
				<InputContainer>
					<TimelineSection date='' newUpdate />
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
								setValue={setNewUpdate}
								setIsLimitExceeded={setIsLimitExceeded}
								limit={UPDATE_LIMIT}
								placeholder='Clear project description explaining who you are and what you want to do with the funds...'
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
							removeUpdate={() => {
								setShowRemoveUpdateModal(true);
								setCurrentUpdate(i.id);
							}}
							editUpdate={(
								title: string,
								content: string,
								updateId: string,
							) => {
								editUpdate(title, content, updateId);
							}}
							isOwner={isOwner}
						/>
					),
			)}
			<ProjectTimeline creationDate={creationDate} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-left: -10px;
	${mediaQueries.tablet} {
		margin-left: 20px;
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 25px 0;
	margin-top: 15px;
	margin-bottom: 42px;
	align-items: flex-end;
	max-width: 668px;
`;

const Title = styled(H5)`
	color: ${brandColors.deep[600]};
	font-weight: 400;
	margin-bottom: 16px;
	margin-left: 30px;
`;

const InputContainer = styled.div`
	margin-bottom: 40px;
	display: flex;
	flex-direction: row;
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
	marginTop: '4px',
	marginBottom: '24px',
	fontFamily: 'body',
	backgroundColor: 'white',
};

export default ProjectUpdates;
