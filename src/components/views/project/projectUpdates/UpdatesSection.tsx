import { FC, useState } from 'react';
import {
	brandColors,
	Button,
	IconEdit,
	IconTrash,
	neutralColors,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { IProjectUpdate } from '@/apollo/types/types';
import {
	Content,
	HorizontalBorder,
	Title,
	Wrapper,
} from '@/components/views/project/projectUpdates/common.styled';
import TimelineSection from '@/components/views/project/projectUpdates/TimelineSection';

const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const UPDATE_LIMIT = 2000;

interface IProps {
	projectUpdate: IProjectUpdate;
	removeUpdate?: Function;
	editUpdate?: Function;
	isOwner?: boolean;
}

const UpdatesSection: FC<IProps> = props => {
	const { isOwner, removeUpdate, editUpdate, projectUpdate } = props;
	const { content, createdAt, title, projectId, id } = projectUpdate;
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [updateContent, setUpdateContent] = useState<string>(content);
	const [newTitle, setNewTitle] = useState<string>(title);

	return (
		<Wrapper id={id}>
			<TimelineSection date={createdAt} />
			<div>
				<Content>
					<ContentSection>
						{isEditing ? (
							<Input
								value={newTitle}
								onChange={e => setNewTitle(e.target.value)}
								placeholder='Type a title...'
							/>
						) : (
							<Title size='large'>{title}</Title>
						)}
						<Description>
							{isEditing ? (
								<RichTextInput
									projectId={projectId}
									value={updateContent}
									style={TextInputStyle}
									setValue={setUpdateContent}
									limit={UPDATE_LIMIT}
									placeholder='Edit your project'
								/>
							) : (
								<RichTextViewer content={content} />
							)}
						</Description>
					</ContentSection>
					{isOwner && (
						<Buttons>
							<Button
								label={isEditing ? 'SAVE' : 'REMOVE'}
								buttonType='texty-primary'
								icon={isEditing ? null : <IconTrash />}
								onClick={async () => {
									if (isEditing) {
										editUpdate &&
											(await editUpdate(
												newTitle,
												updateContent,
												id,
											));
										setIsEditing(false);
									} else {
										removeUpdate && removeUpdate();
									}
								}}
							/>
							<Button
								label={isEditing ? 'CANCEL' : 'EDIT'}
								buttonType='texty-secondary'
								icon={isEditing ? null : <IconEdit />}
								onClick={() => {
									setIsEditing(!isEditing);
									if (isEditing) {
										setUpdateContent(content);
										setNewTitle(title);
									}
								}}
							/>
						</Buttons>
					)}
				</Content>
				<HorizontalBorder />
			</div>
		</Wrapper>
	);
};

const Description = styled(P)`
	color: ${neutralColors.gray[900]};
`;

const Buttons = styled.div`
	display: flex;
	align-items: flex-start;
	> button {
		padding-right: 10px;
		padding-left: 10px;
	}
	> button:first-child {
		color: ${semanticColors.punch[200]};
	}
	> button:last-child {
		color: ${brandColors.deep[100]};
	}
`;

const ContentSection = styled.div`
	width: 100%;
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
	margin-bottom: 15px;
	::placeholder {
		color: ${neutralColors.gray[600]};
	}
`;

const TextInputStyle = {
	marginTop: '4px',
	marginBottom: '100px',
	fontFamily: 'body',
	backgroundColor: 'white',
};

export default UpdatesSection;
