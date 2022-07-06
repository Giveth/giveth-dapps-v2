import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
	Button,
	brandColors,
	neutralColors,
	Subline,
	P,
	H5,
	Lead,
	SublineBold,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IProjectUpdate } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';

const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const UPDATE_LIMIT = 2000;

interface IContent {
	isEditing?: boolean;
}

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
	return (
		<Wrapper>
			<TimelineSection date={props.creationDate} launch />
			<Content>
				<Title>Project Launched! 🎉</Title>
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
			<Content isEditing={isEditing}>
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
								withLimit={UPDATE_LIMIT}
								placeholder='Edit your project'
							/>
						) : (
							<RichTextViewer content={content} />
						)}
					</Description>
				</ContentSection>
				{isOwner &&
					(isEditing ? (
						<AbsolutButtons>
							<UpdateBtn
								label='SAVE'
								buttonType='texty'
								onClick={async () => {
									editUpdate &&
										(await editUpdate(
											newTitle,
											updateContent,
											id,
										));
									setIsEditing(false);
								}}
							/>
							<CancelContainer
								onClick={() => setIsEditing(false)}
							>
								<EditBtn label='CANCEL' buttonType='texty' />
							</CancelContainer>
						</AbsolutButtons>
					) : (
						<ExtraButtons>
							<RemoveContainer
								onClick={() => removeUpdate && removeUpdate()}
							>
								<RemoveBtn label='REMOVE' buttonType='texty' />
								<img src='/images/trash.svg' />
							</RemoveContainer>
							<EditContainer onClick={() => setIsEditing(true)}>
								<EditBtn label='EDIT' buttonType='texty' />
								<img src='/images/edit.svg' />
							</EditContainer>
						</ExtraButtons>
					))}
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
	flex-direction: ${(props: IContent) =>
		props.isEditing ? 'row-reverse' : 'row'};
	justify-content: space-between;
	margin-top: 15px;
	margin-bottom: 42px;
`;

const Wrapper = styled.div`
	display: flex;
	gap: 50px;
`;

const NewUpdate = styled.div`
	text-align: center;
	color: ${neutralColors.gray[600]};
`;

const ExtraButtons = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	img {
		width: 12px;
	}
`;

const AbsolutButtons = styled(ExtraButtons)`
	position: absolute;
`;

const RemoveContainer = styled(Flex)`
	display: flex;
	flex-direction: row;
	cursor: pointer;
	img {
		margin-left: -15px;
	}
`;

const ContentSection = styled.div`
	width: 100%;
`;

const EditContainer = styled(RemoveContainer)``;
const CancelContainer = styled(RemoveContainer)``;
const RemoveBtn = styled(Button)`
	color: ${semanticColors.punch[200]};
	:hover {
		color: ${semanticColors.punch[200]};
		background: transparent;
	}
`;

const EditBtn = styled(Button)`
	color: ${brandColors.deep[100]};
	:hover {
		color: ${brandColors.deep[100]};
		background: transparent;
	}
`;

const UpdateBtn = styled(Button)`
	color: ${brandColors.pinky[500]};
	:hover {
		color: ${brandColors.pinky[600]};
		background: transparent;
	}
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
	marginBottom: '100px',
	fontFamily: 'body',
	backgroundColor: 'white',
};

export default ProjectTimeline;
