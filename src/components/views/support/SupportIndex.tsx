import { Arc } from '@/components/styled-components/Arc';
import questionIcon from '/public/images/ask_question.svg';
import feedbackIcon from '/public/images/feedback.svg';
import reportIcon from '/public/images/report_issue.svg';
import featureIcon from '/public/images/request_feature.svg';
import SupportCard from '@/components/GeneralCard';
import links from '@/lib/constants/links';
import { brandColors, D3 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';

const SupportIndex = () => {
	return (
		<>
			<UpperSection>
				<ArcCyan />
				<DotCyan />
				<ArcPurple />
				<TextContainer>
					<Title>How can we help you?</Title>
				</TextContainer>
			</UpperSection>

			<CardsSection>
				{cardsArray.map(i => (
					<SupportCard key={i.title} content={i} />
				))}
			</CardsSection>
		</>
	);
};

const CardsSection = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 25px;
	position: relative;
	z-index: 3;
	max-width: 1250px;
	margin: -50px auto 0;
	padding: 0 16px 48px;
`;

const cardsArray = [
	{
		icon: questionIcon,
		title: 'Ask us a Question',
		caption:
			'Do you have a specific question or a general inquiry that requires a response?',
		buttonLabel: 'ask us a question',
		route: links.ASK_QUESTION,
	},
	{
		icon: reportIcon,
		title: 'Report an issue',
		caption:
			'Having problems with our site? Is something not functioning as expected?',
		buttonLabel: 'Report an issue',
		route: links.REPORT_ISSUE,
	},
	{
		icon: feedbackIcon,
		title: 'Leave Feedback',
		caption:
			'Let us know how your experience was! \n' + 'How can we improve?',
		buttonLabel: 'Leave Feedback',
		route: links.FEEDBACK,
	},
	{
		icon: featureIcon,
		title: 'Request a New Feature',
		caption:
			'Want to see a new feature on Giveth? Are we missing a critical functionality?',
		buttonLabel: 'Request a New Feature',
		route: links.FEATURE_REQUEST,
	},
];

const ArcPurple = styled(Arc)`
	border-width: 140px;
	border-color: ${brandColors.giv[600]} transparent transparent transparent;
	bottom: -585px;
	right: -750px;
	width: 1170px;
	height: 1170px;
	transform: rotate(-45deg);
	z-index: 0;
`;

const ArcCyan = styled(Arc)`
	border-width: 90px;
	border-color: transparent transparent ${brandColors.cyan[500]} transparent;
	width: 520px;
	height: 520px;
	transform: rotate(31deg);
	z-index: 1;
	bottom: -150px;
	right: -430px;

	${mediaQueries.laptop} {
		right: -230px;
		bottom: -30px;
	}
`;

const DotCyan = styled(Arc)`
	border-width: 55px;
	border-color: ${brandColors.cyan[500]};
	bottom: 100px;
	right: 10px;
	width: 100px;
	height: 100px;
	z-index: 1;

	${mediaQueries.laptop} {
		right: 210px;
		bottom: 235px;
	}
`;

const TextContainer = styled.div`
	max-width: 670px;
	position: relative;
	z-index: 2;
`;

const UpperSection = styled.div`
	background: ${brandColors.giv[500]};
	color: white;
	overflow: hidden;
	position: relative;
	padding: 150px 30px;

	${mediaQueries.tablet} {
		padding: 150px 130px;
	}
`;

const Title = styled(D3)`
	margin: 30px 0 24px 0;
`;

export default SupportIndex;
