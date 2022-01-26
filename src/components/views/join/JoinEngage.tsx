import Image from 'next/image'
import Card from '@/components/GeneralCard'
import YellowFlower from '/public/images/yellow_flower.svg'
import BlueFlower from '/public/images/blue_flower.svg'
import discord_icon from '/public/images/discord_icon.svg'
import discourse_icon from '/public/images/discourse_icon.svg'
import github_icon from '/public/images/github_icon.svg'
import telegram_icon from '/public/images/telegram_icon.svg'
import medium_icon from '/public/images/medium_icon.svg'
import twitter_icon from '/public/images/twitter_icon.svg'
import youtube_icon from '/public/images/youtube_icon.svg'
import reddit_icon from '/public/images/reddit_icon.svg'
import links from '@/lib/constants/links'
import { Lead, brandColors, H2 } from '@giveth/ui-design-system'
import styled from 'styled-components'

const JoinEngage = () => {
  return (
    <>
      <UpperSection>
        <LeadText>
          Giveth is first and foremost a community of givers and changemakers. We are passionate
          people working together to build a crypto-economic system that can reward giving to good
          causes. Our project is open-source, decentralized, altruistic, and community-led. Want to
          get more involved?
        </LeadText>
        <br />
        <LeadText>
          Follow our social media and come say hello in a channel below, we look forward to
          welcoming you!
        </LeadText>
        <div style={{ position: 'absolute' }}>
          <Image src={YellowFlower} alt='yellowflower' />
        </div>
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
          </CardsConsumeSection>
          <BlueFlowerComponent>
            <Image src={BlueFlower} alt='blueflower' />
          </BlueFlowerComponent>
        </Section>
      </UpperSection>
    </>
  )
}

const engageArray = [
  {
    icon: discord_icon,
    title: 'Discord',
    caption:
      'Join the conversation! Discord is where our team communicates. Introduce yourself, give us feedback, find out how to contribute or just say hello!',
    buttonLabel: 'join us on discord',
    route: links.DISCORD
  },
  {
    icon: discourse_icon,
    title: 'Discourse',
    caption:
      'The Giveth forum is where we create discourse around new and existing proposals. We share ideas involving development and governance, cultivating discussions about important topics around our team and community.',
    buttonLabel: 'join on discourse',
    route: links.DISCOURSE
  },
  {
    icon: github_icon,
    title: 'Github',
    caption:
      'Got some developer skills? Check out our Github! We always welcome new contributors. Please also join one of our dev channels in Discord to say hello!',
    buttonLabel: 'join us on github',
    route: links.GITHUB
  },
  {
    icon: telegram_icon,
    title: 'Telegram',
    caption:
      'Not on Discord? Join our Telegram! This group is bridged directly to the #general channel in the Giveth discord so we’ll see all of your messages here.',
    buttonLabel: 'join us on telegram',
    route: links.TELEGRAM
  }
]

const consumeArray = [
  {
    icon: medium_icon,
    title: 'Medium',
    caption:
      'Keep up with our Medium blog where we publish regular development and community updates with the latest and greatest.',
    buttonLabel: 'join us on medium',
    route: links.MEDIUM
  },
  {
    icon: twitter_icon,
    title: 'Twitter',
    caption:
      'Connect with us on Twitter to stay up-to-date on exciting shares about the Future of Giving!',
    buttonLabel: 'join on twitter',
    route: links.TWITTER
  },
  {
    icon: youtube_icon,
    title: 'Youtube',
    caption:
      'Check out presentations, interviews, AMAs and more on the Giveth Youtube. Also follow our Transparency channel for recordings of our calls.',
    buttonLabel: 'join us on youtube',
    route: links.YOUTUBE
  },
  {
    icon: reddit_icon,
    title: 'Reddit',
    caption:
      'Subscribe to our r/Giveth subreddit to stay abreast of updates, engage in discussions and upvote all the things.',
    buttonLabel: 'join us on reddit',
    route: links.REDDIT
  }
]

const UpperSection = styled.div`
  padding: 150px 0;
  color: white;
  overflow: hidden;
  position: relative;
`
const LeadText = styled(Lead)`
  color: ${brandColors.giv[900]};
  margin: 0 20%;
`
const Title = styled(H2)`
  color: ${brandColors.giv[700]};
  margin: 7% 20%;
  position: relative;
  z-index: 1;
`
const Section = styled.div`
  position: relative;
  text-align: center;
  margin: 2% 0 0 0;
`
const CardsSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  flex-wrap: wrap;
  gap: 25px;
  position: relative;
  z-index: 3;
`
const CardsConsumeSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const BlueFlowerComponent = styled.div`
  position: absolute;
  right: 0;
  top: -100px;
  z-index: 0;
`

export default JoinEngage
