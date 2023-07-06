import { useIntl } from 'react-intl';
import {
	Content,
	HorizontalBorder,
	Title,
	Wrapper,
} from '@/components/views/project/projectUpdates/common.styled';
import TimelineSection from '@/components/views/project/projectUpdates/TimelineSection';

const LaunchSection = (props: { creationDate: string }) => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<TimelineSection date={props.creationDate} launch />
			<div>
				<Content>
					<Title size='large'>
						{formatMessage({ id: 'label.project_launched' })} 🎉
					</Title>
					{/*TODO share in twitter?*/}
					{/* <Button label='Share this'></Button> */}
				</Content>
				<HorizontalBorder />
			</div>
		</Wrapper>
	);
};

export default LaunchSection;
