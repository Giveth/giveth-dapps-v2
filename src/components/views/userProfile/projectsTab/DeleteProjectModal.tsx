import styled from 'styled-components';
import { useCallback, type FC } from 'react';
import { Button, Flex, IconTrash32, P } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IProject } from '@/apollo/types/types';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { client } from '@/apollo/apolloClient';
import { DELETE_DRAFT_PROJECT } from '@/apollo/gql/gqlProjects';
import { useProfileContext } from '@/context/profile.context';

interface IDeleteProjectModal extends IModal {
	project: IProject;
}

const DeleteProjectModal: FC<IDeleteProjectModal> = ({
	setShowModal,
	project,
}) => {
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const queryClient = useQueryClient();
	const { user } = useProfileContext();

	const deleteProjectMutation = useMutation({
		mutationFn: (projectId: string) =>
			client.mutate({
				mutation: DELETE_DRAFT_PROJECT,
				variables: { id: projectId },
			}),
		// On success, refetch the user's projects
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [user.id, 'projects'],
			});
		},
	});

	const handleRemoveProject = useCallback(async () => {
		deleteProjectMutation.mutate(project.id);
	}, [deleteProjectMutation, project.id]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Confirm Project Removal'
			headerIcon={<IconTrash32 />}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<P>
					{formatMessage(
						{
							id: 'component.delete_project.confirmation',
						},
						{
							title: project.title,
						},
					)}
				</P>
				<Flex gap='24px' $flexDirection='column' $alignItems='center'>
					<Button
						buttonType='primary'
						label={formatMessage({
							id: 'component.delete_project.yes',
						})}
						size='small'
						onClick={handleRemoveProject}
					/>
					<Button
						buttonType='texty-gray'
						label={formatMessage({
							id: 'component.delete_project.no',
						})}
						size='small'
						onClick={() => setShowModal(false)}
					/>
				</Flex>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled(Flex)`
	padding: 24px;
	min-width: 450px;
	flex-direction: column;
	gap: 36px;
`;

export default DeleteProjectModal;
