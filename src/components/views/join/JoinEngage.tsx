import Image from 'next/image';
import { Lead, brandColors, H2 } from '@giveth/ui-design-system';
import styled from 'styled-components';

import Card from '@/components/GeneralCard';
import YellowFlower from '/public/images/yellow_flower.svg';
import BlueFlower from '/public/images/blue_flower.svg';
import discord_icon from '/public/images/discord_icon.svg';
import discourse_icon from '/public/images/discourse_icon.svg';
import github_icon from '/public/images/github_icon.svg';
import telegram_icon from '/public/images/telegram_icon.svg';
import medium_icon from '/public/images/medium_icon.svg';
import twitter_icon from '/public/images/twitter_icon.svg';
import youtube_icon from '/public/images/youtube_icon.svg';
import reddit_icon from '/public/images/reddit_icon.svg';
import links from '@/lib/constants/links';
import JoinSubscriptionCard from './JoinSubscriptionCard';
import { FlexCenter } from '@/components/styled-components/Flex';
import { ButtonStyled } from '@/components/GeneralCard.sc';
import { Container } from '@/components/Grid';

const JoinEngage = () => {
	return (
		<>
			<ContainerStyled>
				<LeadText>
					Giveth is first and foremost a community of givers and
					changemakers. We are passionate people working together to
					build a crypto-economic system that can reward giving to
					good causes. Our project is open-source, decentralized,
					altruistic, and community-led.
				</LeadText>
				<br />
				<LeadText>
					You can join our Community Call every Thursday in Discord,
					follow our social media, or come say hello in a channel
					below. We look forward to welcoming you!
				</LeadText>
				<br />
				<FlexCenter>
					<ButtonStyled
						buttonType='primary'
						label='Add to Calendar'
						onClick={() => window.open(links.ADD_TO_CALENDAR)}
					/>
				</FlexCenter>

				<Section>
					<Title>Engage</Title>
					<CardsSection>
						{engageArray.map(i => (
							<Card key={i.title} content={i} />
						))}
					</CardsSection>
				</Section>
				<Section>
					<Title>Consume</Title>
					<CardsConsumeSection>
						{consumeArray.map(i => (
							<Card key={i.title} content={i} isHorizontal />
						))}
						<JoinSubscriptionCard />
					</CardsConsumeSection>
				</Section>
			</ContainerStyled>
			<YellowFlowerComponent>
				<Image src={YellowFlower} alt='yellow flower' />
			</YellowFlowerComponent>
			<BlueFlowerComponent>
				<Image src={BlueFlower} alt='blue flower' />
			</BlueFlowerComponent>
		</>
	);
};

const engageArray = [
	{
		icon: discord_icon,
		title: 'Discord',
		caption:
			'Join the conversation! Discord is where our team communicates. Introduce yourself, give us feedback, find out how to contribute or just say hello!',
		buttonLabel: 'join us on discord',
		route: links.DISCORD,
	},
	{
		icon: discourse_icon,
		title: 'Discourse',
		caption:
			'The Giveth forum is where we create discourse around new and existing proposals. We share ideas involving development and governance, cultivating discussions about important topics around our team and community.',
		buttonLabel: 'join us on discourse',
		route: links.DISCOURSE,
	},
	{
		icon: github_icon,
		title: 'Github',
		caption:
			'Got some developer skills? Check out our Github! We always welcome new contributors. Please also join one of our dev channels in Discord to say hello!',
		buttonLabel: 'join us on github',
		route: links.GITHUB,
	},
	{
		icon: telegram_icon,
		title: 'Telegram',
		caption:
			'Not on Discord? Join our Telegram! This group is bridged directly to the #general channel in the Giveth discord so we’ll see all of your messages here.',
		buttonLabel: 'join us on telegram',
		route: links.TELEGRAM,
	},
];

const consumeArray = [
	{
		icon: medium_icon,
		title: 'Medium',
		caption:
			'Keep up with our Medium blog where we publish regular development and community updates with the latest and greatest.',
		buttonLabel: 'join us on medium',
		route: links.MEDIUM,
	},
	{
		icon: twitter_icon,
		title: 'Twitter',
		caption:
			'Connect with us on Twitter to stay up-to-date on exciting shares about the Future of Giving!',
		buttonLabel: 'join us on twitter',
		route: links.TWITTER,
	},
	{
		icon: youtube_icon,
		title: 'Youtube',
		caption:
			'Check out presentations, interviews, AMAs and more on the Giveth Youtube. Also follow our Transparency channel for recordings of our calls.',
		buttonLabel: 'join us on youtube',
		route: links.YOUTUBE,
	},
	{
		icon: reddit_icon,
		title: 'Reddit',
		caption:
			'Subscribe to our r/Giveth subreddit to stay abreast of updates, engage in discussions and upvote all the things.',
		buttonLabel: 'join us on reddit',
		route: links.REDDIT,
	},
];

const ContainerStyled = styled(Container)`
	max-width: 1205px;
	margin-bottom: 80px;
	margin-top: 80px;
	position: relative;
	z-index: 1;
`;
const LeadText = styled(Lead)`
	color: ${brandColors.giv[900]};
	max-width: 900px;
	margin: 0 auto;
`;
const Title = styled(H2)`
	color: ${brandColors.giv[700]};
	margin: 100px auto;
	position: relative;
	z-index: 1;
`;
const Section = styled.div`
	position: relative;
	text-align: center;
`;
const CardsSection = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: 50px auto 0;
	gap: 25px;
	position: relative;
	z-index: 3;
`;
const CardsConsumeSection = styled(FlexCenter)`
	flex-direction: column;
	gap: 25px;
`;
const BlueFlowerComponent = styled.div`
	position: absolute;
	right: 0;
	top: 3100px;
	z-index: 0;
`;
const YellowFlowerComponent = styled.div`
	position: absolute;
	left: 0;
	top: 1100px;
	z-index: 0;
`;

export default JoinEngage;
