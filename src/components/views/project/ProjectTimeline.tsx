import dynamic from 'next/dynamic';
import { IProjectUpdate } from '@/apollo/types/types';
import {
	Button,
	brandColors,
	neutralColors,
	Subline,
	P,
	H5,
	Lead,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const ProjectTimeline = (props: {
	projectUpdate?: IProjectUpdate;
	creationDate?: string;
}) => {
	const { projectUpdate, creationDate } = props;

	if (creationDate) return <LaunchSection creationDate={creationDate} />;
	else if (projectUpdate)
		return <UpdatesSection projectUpdate={projectUpdate} />;
	else return null;
};

const LaunchSection = (props: { creationDate: string }) => {
	return (
		<Wrapper>
			<TimelineSection date={props.creationDate} launch />
			<Content>
				<Title>Project Launched! 🎉</Title>
				{/*TODO share in twitter?*/}
				<Button label='Share this'></Button>
			</Content>
		</Wrapper>
	);
};

const UpdatesSection = (props: { projectUpdate: IProjectUpdate }) => {
	const { content, createdAt, title } = props.projectUpdate;
	return (
		<Wrapper>
			<TimelineSection date={createdAt} />
			<Content>
				<Title>{title}</Title>
				<Description>
					<RichTextViewer content={content} />
				</Description>
			</Content>
		</Wrapper>
	);
};

const TimelineSection = (props: { date: string; launch?: boolean }) => {
	const date = new Date(props.date);
	const year = date.getFullYear();
	const month = date.toLocaleString('default', { month: 'short' });
	const day = date.getDate();
	return (
		<TimelineStyled>
			<MonthYear>{month}</MonthYear>
			<Day>{day}</Day>
			<MonthYear>{year}</MonthYear>
			{!props.launch && <Border />}
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
`;

const Content = styled.div`
	margin-top: 15px;
	margin-bottom: 42px;
`;

const Wrapper = styled.div`
	display: flex;
	gap: 50px;
`;

export default ProjectTimeline;
