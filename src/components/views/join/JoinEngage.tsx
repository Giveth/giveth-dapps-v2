import Image from 'next/image';
import { Lead, brandColors, H2 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

import { Container } from '@giveth/ui-design-system';
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
import { FlexCenter } from '@/components/styled-components/Flex';
import { ButtonStyled } from '@/components/GeneralCard.sc';
import GetUpdates from '@/components/GetUpdates';

const JoinEngage = () => {
	const { formatMessage } = useIntl();

	const engageArray = [
		{
			icon: discord_icon,
			title: 'Discord',
			caption: formatMessage({ id: 'page.engage.discord.desc' }),
			buttonLabel: `${formatMessage({ id: 'label.join_us_on' })} discord`,
			route: links.DISCORD,
		},
		{
			icon: discourse_icon,
			title: 'Discourse',
			caption: formatMessage({ id: 'page.engage.discourse.desc' }),
			buttonLabel: `${formatMessage({
				id: 'label.join_us_on',
			})} discourse`,
			route: links.DISCOURSE,
		},
		{
			icon: github_icon,
			title: 'Github',
			caption: formatMessage({ id: 'page.engage.github.desc' }),
			buttonLabel: `${formatMessage({ id: 'label.join_us_on' })} github`,
			route: links.GITHUB,
		},
		{
			icon: telegram_icon,
			title: 'Telegram',
			caption: formatMessage({ id: 'page.engage.telegram.desc' }),
			buttonLabel: `${formatMessage({
				id: 'label.join_us_on',
			})} telegram`,
			route: links.TELEGRAM,
		},
	];

	const consumeArray = [
		{
			icon: medium_icon,
			title: 'Medium',
			caption: formatMessage({ id: 'page.learn.medium.desc' }),
			buttonLabel: `${formatMessage({ id: 'label.join_us_on' })} medium`,
			route: links.MEDIUM,
		},
		{
			icon: twitter_icon,
			title: 'Twitter',
			caption: formatMessage({ id: 'page.learn.twitter.desc' }),
			buttonLabel: `${formatMessage({ id: 'label.join_us_on' })} twitter`,
			route: links.TWITTER,
		},
		{
			icon: youtube_icon,
			title: 'Youtube',
			caption: formatMessage({ id: 'page.learn.youtube.desc' }),
			buttonLabel: `${formatMessage({ id: 'label.join_us_on' })} youtube`,
			route: links.YOUTUBE,
		},
		{
			icon: reddit_icon,
			title: 'Reddit',
			caption: formatMessage({ id: 'page.learn.reddit.desc' }),
			buttonLabel: `${formatMessage({ id: 'label.join_us_on' })} reddit`,
			route: links.REDDIT,
		},
	];

	return (
		<>
			<ContainerStyled>
				<LeadText>
					{formatMessage({ id: 'label.join_desc_one' })}
				</LeadText>
				<br />
				<LeadText>
					{formatMessage({ id: 'label.join_desc_two' })}
				</LeadText>
				<br />
				<FlexCenter>
					<ButtonStyled
						buttonType='primary'
						label={formatMessage({ id: 'label.add_to_calendar' })}
						onClick={() => window.open(links.ADD_TO_CALENDAR)}
					/>
				</FlexCenter>

				<Section>
					<Title>{formatMessage({ id: 'label.engage' })}</Title>
					<CardsSection>
						{engageArray.map(i => (
							<Card key={i.title} content={i} />
						))}
					</CardsSection>
				</Section>
				<Section>
					<Title>{formatMessage({ id: 'label.learn' })}</Title>
					<CardsConsumeSection>
						{consumeArray.map(i => (
							<Card key={i.title} content={i} isHorizontal />
						))}
					</CardsConsumeSection>
				</Section>
			</ContainerStyled>
			<GetUpdates />
			<br />
			<YellowFlowerComponent>
				<Image src={YellowFlower} alt='yellow flower' />
			</YellowFlowerComponent>
			<BlueFlowerComponent>
				<Image src={BlueFlower} alt='blue flower' />
			</BlueFlowerComponent>
		</>
	);
};

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
