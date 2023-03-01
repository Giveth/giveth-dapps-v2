import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import {
	Button,
	brandColors,
	neutralColors,
	Subline,
	P,
	H5,
	Lead,
	SublineBold,
	IconTrash,
	IconEdit,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IProjectUpdate } from '@/apollo/types/types';

const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const UPDATE_LIMIT = 2000;

const ProjectTimeline = (props: {
	projectUpdate?: IProjectUpdate;
	creationDate?: string;
	removeUpdate?: Function;
	editUpdate?: Function;
	isOwner?: boolean;
}) => {
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

const LaunchSection = (props: { creationDate: string }) => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<TimelineSection date={props.creationDate} launch />
			<Content>
				<Title>
					{formatMessage({ id: 'label.project_launched' })} 🎉
				</Title>
				{/*TODO share in twitter?*/}
				{/* <Button label='Share this'></Button> */}
			</Content>
		</Wrapper>
	);
};

const UpdatesSection = (props: {
	projectUpdate: IProjectUpdate;
	removeUpdate?: Function;
	editUpdate?: Function;
	isOwner?: boolean;
}) => {
	const { isOwner, removeUpdate, editUpdate } = props;
	const { content, createdAt, title, projectId, id } = props.projectUpdate;
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [updateContent, setUpdateContent] = useState<string>(content);
	const [newTitle, setNewTitle] = useState<string>(title);

	return (
		<Wrapper>
			<TimelineSection date={createdAt} />
			<Content>
				<ContentSection>
					{isEditing ? (
						<Input
							value={newTitle}
							onChange={e => setNewTitle(e.target.value)}
							placeholder='Type a title...'
						/>
					) : (
						<Title>{title}</Title>
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
		</Wrapper>
	);
};

export const TimelineSection = (props: {
	date: string;
	launch?: boolean;
	newUpdate?: boolean;
}) => {
	const date = new Date(props?.date);
	const year = date.getFullYear();
	const month = date.toLocaleString('default', { month: 'short' });
	const day = date.getDate();
	return (
		<TimelineStyled>
			{props.newUpdate ? (
				<>
					<NewUpdate>
						<SublineBold>NEW UPDATE</SublineBold>
					</NewUpdate>
					<Border />
				</>
			) : (
				<>
					<MonthYear>{month}</MonthYear>
					<Day>{day}</Day>
					<MonthYear>{year}</MonthYear>
					{!props.launch && <Border />}
				</>
			)}
		</TimelineStyled>
	);
};

const Border = styled.div`
	margin: 16px 0;
	height: 100%;
	border-right: 1px solid ${neutralColors.gray[400]};
`;

const MonthYear = styled(Subline)`
	color: ${neutralColors.gray[600]};
	text-transform: uppercase;
`;

const Day = styled(Lead)`
	color: ${brandColors.deep[600]};
`;

const TimelineStyled = styled.div`
	width: 50px;
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
`;

const Description = styled(P)`
	color: ${brandColors.giv[900]};
`;

const Title = styled(H5)`
	color: ${brandColors.deep[600]};
	font-weight: 400;
	margin-bottom: 16px;
	word-break: break-word;
`;

const Content = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin-top: 15px;
	margin-bottom: 42px;
	flex-direction: column;
	gap: 25px 0;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const Wrapper = styled.div`
	display: flex;
	${mediaQueries.tablet} {
		gap: 50px;
	}
`;

const NewUpdate = styled.div`
	text-align: center;
	color: ${neutralColors.gray[600]};
`;

const Buttons = styled.div`
	display: flex;
	align-items: flex-start;
	> button {
		padding-right: 10px;
		padding-left: 10px;
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

export default ProjectTimeline;
