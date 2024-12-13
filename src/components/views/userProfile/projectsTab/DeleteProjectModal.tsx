import styled from 'styled-components';
import { useState, type FC } from 'react';
import { Button, Flex, IconTrash32, P } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { IProject } from '@/apollo/types/types';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { client } from '@/apollo/apolloClient';
import { DELETE_DRAFT_PROJECT } from '@/apollo/gql/gqlProjects';
import { useAppDispatch } from '@/features/hooks';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

interface IDeleteProjectModal extends IModal {
	project: IProject;
	refetchProjects: () => void;
}

const DeleteProjectModal: FC<IDeleteProjectModal> = ({
	setShowModal,
	project,
	refetchProjects,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();
	const { walletAddress } = useGeneralWallet();

	const { mutate: deleteProject, isPending } = useMutation({
		mutationFn: (projectId: number) =>
			client.mutate({
				mutation: DELETE_DRAFT_PROJECT,
				variables: { projectId: projectId },
			}),
		onSuccess: async () => {
			setIsLoading(true);
			await refetchProjects();
			walletAddress &&
				(await dispatch(fetchUserByAddress(walletAddress)));
			setIsLoading(false);
			closeModal();
		},
	});

	const handleRemoveProject = async () => {
		deleteProject(Number(project.id));
	};

	const loading = isPending || isLoading;

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
						loading={loading}
					/>
					<Button
						buttonType='texty-gray'
						label={formatMessage({
							id: 'component.delete_project.no',
						})}
						size='small'
						onClick={() => setShowModal(false)}
						disabled={loading}
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
