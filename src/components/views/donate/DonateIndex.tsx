import React, { useState } from 'react'
import Image from 'next/image'
import { useWeb3React } from '@web3-react/core'
import ProjectCard from '@/components/project-card/ProjectCardAlt'
import CryptoDonation from './CryptoDonation'
import FiatDonation from './FiatDonation'
import { IProjectBySlug } from '@/apollo/types/types'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share'
import { BigArc } from '@/components/styled-components/Arc'
import { Button } from '@/components/styled-components/Button'
import ConfettiAnimation from '../../animations/confetti'
import RadioOnIcon from '/public/images/radio_on.svg'
import RadioOffIcon from '/public/images/radio_off.svg'
import { formatEtherscanLink } from '../../../utils'
import {
  H4,
  brandColors,
  P,
  Lead,
  neutralColors,
  H6,
  Subline,
  GLink,
  semanticColors
} from '@giveth/ui-design-system'
import Link from 'next/link'
import styled from 'styled-components'

const CRYPTO_DONATION = 'Cryptocurrency'
const FIAT_DONATION = 'Credit Card'

const ProjectsIndex = (props: IProjectBySlug) => {
  const { project } = props
  const [donationType, setDonationType] = useState(CRYPTO_DONATION)
  const [isSuccess, setSuccess] = useState<any>(false)

  const context = useWeb3React()
  const { chainId: networkId } = context

  const givBackEligible = isSuccess?.givBackEligible
  const txHash = isSuccess?.transactionHash

  const shareTitle =
    'I am a Giver and you can be one too! 💙 @givethio. Let’s Build the Future of Giving together! 🙌 🌈 #maketheworldabetterplace 🌏 💜'
  const url = typeof window !== 'undefined' ? window?.location?.href : null

  const TypeSelection = () => {
    const RadioOn = () => <Image src={RadioOnIcon} alt='radio on' />
    const RadioOff = () => <Image src={RadioOffIcon} alt='radio off' />

    const RadioTitle = (props: { type: string }) => {
      const isTypeSelected = props.type === donationType
      return (
        <>
          <RadioTitleBox
            onClick={() =>
              setDonationType(props.type === CRYPTO_DONATION ? CRYPTO_DONATION : FIAT_DONATION)
            }
          >
            {props.type === donationType ? <RadioOn /> : <RadioOff />}
            <div style={{ marginLeft: '16px' }}>
              <RadioTitleText isSelected={isTypeSelected}>{props.type}</RadioTitleText>
              <RadioSubtitleText isSelected={isTypeSelected}>
                {props.type === CRYPTO_DONATION ? 'Zero Fees' : 'Bank Fees'}
              </RadioSubtitleText>
            </div>
          </RadioTitleBox>
        </>
      )
    }

    return (
      <>
        <RadioBox>
          <RadioTitle type={CRYPTO_DONATION} />
          <RadioTitle type={FIAT_DONATION} />
        </RadioBox>
        {donationType === CRYPTO_DONATION ? (
          <CryptoDonation project={project} setSuccessDonation={hash => setSuccess(hash)} />
        ) : (
          <FiatDonation project={project} setSuccessDonation={() => setSuccess(true)} />
        )}
      </>
    )
  }

  const SocialBox = (props: any) => {
    return (
      <Social isSuccess={props.isSuccess}>
        <Lead>
          {props?.isSuccess
            ? 'Share this with your friends'
            : 'Can’t donate? Share this page instead.'}
        </Lead>
        <SocialItems>
          <SocialItem isSuccess={props.isSuccess}>
            <TwitterShareButton title={shareTitle} url={url || ''} hashtags={['Giveth']}>
              <Image src={'/images/social-tw.svg'} alt='tw' width='44px' height='44px' />
            </TwitterShareButton>
          </SocialItem>
          <SocialItem isSuccess={props.isSuccess}>
            <LinkedinShareButton title={shareTitle} summary={project?.description} url={url || ''}>
              <Image src={'/images/social-linkedin.svg'} alt='lin' width='44px' height='44px' />
            </LinkedinShareButton>
          </SocialItem>
          <SocialItem isSuccess={props.isSuccess}>
            <FacebookShareButton quote={shareTitle} url={url || ''} hashtag='#Giveth'>
              <Image src={'/images/social-fb.svg'} alt='fb' width='44px' height='44px' />
            </FacebookShareButton>
          </SocialItem>
        </SocialItems>
      </Social>
    )
  }

  const SuccessView = () => {
    return (
      <SucceessContainer>
        <ConfettiContainer>
          <ConfettiAnimation size={300} />
        </ConfettiContainer>
        <H4 color={semanticColors.jade[500]}>You're a giver now!</H4>
        {/* <Image src='/images/motivation.svg' alt='motivation' width='121px' height='121px' /> */}
        <SuccessMessage>
          Thank you for supporting The Giveth Community of Makers. Your contribution goes a long
          way!
        </SuccessMessage>
        {givBackEligible && (
          <GivBackContainer>
            <H6>You're eligible for GIVbacks!</H6>
            <P>
              GIV rewards from the GIVbacks program will be distributed after the end of the current
              round.
            </P>
            <Link passHref href='/givbacks'>
              <LearnButton small background={brandColors.giv[500]} width='100%'>
                LEARN MORE
              </LearnButton>
            </Link>
          </GivBackContainer>
        )}
        {!givBackEligible && <SocialBox isSuccess />}
        <Options>
          <P style={{ color: neutralColors.gray[900] }}>Your transaction has been submitted.</P>
          <GLink
            style={{
              color: brandColors.pinky[500],
              fontSize: '16px',
              cursor: 'pointer',
              margin: '8px 0 24px 0'
            }}
          >
            <a
              href={formatEtherscanLink('Transaction', [networkId, txHash])}
              target='_blank'
              rel='noopener noreferrer'
            >
              View on explorer
            </a>
          </GLink>
          <Link passHref href='/projects'>
            <ProjectsButton small background={brandColors.giv[500]} width='100%'>
              SEE MORE PROJECTS
            </ProjectsButton>
          </Link>
        </Options>
      </SucceessContainer>
    )
  }

  return (
    <>
      <BigArc />
      <Wrapper>
        <Sections>
          <Left>
            <ProjectCard key={project.id} project={project} />
          </Left>
          <Right>
            {isSuccess ? (
              <SuccessView />
            ) : (
              <>
                <H4>Donate With</H4>
                <TypeSelection />
              </>
            )}
          </Right>
        </Sections>
        {!isSuccess && <SocialBox />}
      </Wrapper>
    </>
  )
}

const ConfettiContainer = styled.div`
  position: absolute;
  top: 200px;
`

const Social = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: ${(props: { isSuccess: boolean }) => (props.isSuccess ? 0 : '12px 0')};
  color: ${(props: { isSuccess: boolean }) =>
    props.isSuccess === true ? neutralColors.gray[900] : 'white'};
  align-items: center;
`
const SocialItems = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  margin: 8px 0 0 0;
`
const SocialItem = styled.div`
  cursor: pointer;
  border-radius: 8px;
  padding: ${(props: { isSuccess: boolean }) => (props.isSuccess ? `0 6px` : '0 12px')};
  margin: ${(props: { isSuccess: boolean }) => (props.isSuccess ? `0 12px` : '0')};
  border: ${(props: { isSuccess: boolean }) =>
    props.isSuccess ? `1px solid ${neutralColors.gray[400]}` : 'none'};
`
const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer !important;
  margin-bottom: 26px;
  min-width: 400px;
`
const Wrapper = styled.div`
  text-align: center;
  margin: 60px 194px;
  align-items: center;
`
const Sections = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(500px, 1fr));
  grid-auto-rows: minmax(100px, auto);
`
const Left = styled.div`
  display: grid;
  justify-content: center;
  grid-auto-flow: column;
  z-index: 1;
  grid-column: 1 / 2;
  grid-row: 1;
  background: ${neutralColors.gray[200]};
  padding: 29px 0;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
`
const Right = styled.div`
  z-index: 1;
  grid-row: 1;
  background: white;
  text-align: left;
  padding: 65px 32px 32px;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  h4 {
    color: ${brandColors.deep[700]};
    font-weight: bold;
  }
`
const Title = styled(H6)`
  margin-left: 30.67px;
  span {
    color: ${neutralColors.gray[700]};
  }
`
const RadioTitleText = styled(Lead)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`
const RadioSubtitleText = styled(Subline)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`
const RadioBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 29px;
  margin-bottom: 40px;
  div:first-child {
    margin-right: 32px;
  }
`
const RadioTitleBox = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
`
const SucceessContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 0 39px;
  color: ${brandColors.deep[900]};
  height: 100%;
  min-height: 400px;
  max-height: 620px;
`
const SuccessMessage = styled(P)`
  margin: -19px 0 16px 0;
  color: ${brandColors.deep[900]};
`
const Options = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const ProjectsButton = styled(Button)`
  width: 242px;
  height: 48px;
  font-size: 12px;
`
const LearnButton = styled(Button)`
  width: 200px;
  height: 48px;
  font-size: 16px;
  border-color: white;
  margin: 16px 0 0 0;
`

const GivBackContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 454px;
  height: 212px;
  padding: 0 53px;
  align-items: center;
  background-image: url(/images/GIVeconomy_Banner.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 12px;
  color: white;
  h6 {
    font-weight: bold;
    margin: 0 0 8px 0;
  }
`

export default ProjectsIndex
