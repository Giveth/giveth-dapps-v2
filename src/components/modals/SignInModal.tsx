import React, { useState } from 'react'
import Modal from 'react-modal'

import Image from 'next/image'
import { useWeb3React } from '@web3-react/core'

import { Shadow } from '@/components/styled-components/Shadow'
import closeIcon from '/public/images/close.svg'
import ethIcon from '/public/images/tokens/eth.png'
import googleIcon from '/public/images/google_icon.svg'
import twitterIcon from '/public/images/social-tt.svg'
import facebookIcon from '/public/images/social-fb2.svg'
import discordIcon from '/public/images/social-disc.svg'
import torusBrand from '/public/images/torus_pwr.svg'
import { mediaQueries } from '@/lib/helpers'
import { torusConnector } from '@/lib/wallet/walletTypes'
import { H3, P, brandColors, neutralColors, B } from '@giveth/ui-design-system'
import styled from 'styled-components'
import WalletModal from './WalletModal'

interface ISignInModal {
  showModal: boolean
  closeModal: () => void
}

const SignInModal = ({ showModal, closeModal }: ISignInModal) => {
  const context = useWeb3React()
  const { activate } = context
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false)

  const handleSocialConnection = (): void => {
    activate(torusConnector)
      .then(() => closeModal())
      .catch((e: any) => {
        // toast to inform error
        console.log(e)
      })
  }
  return (
    <>
      {showWalletModal && (
        <WalletModal
          showModal={showWalletModal}
          setShowModal={setShowWalletModal}
          closeParentModal={closeModal}
        />
      )}
      <Modal isOpen={showModal} style={customStyles}>
        <CloseButton onClick={closeModal}>
          <Image src={closeIcon} alt='close' />
        </CloseButton>
        <ModalGrid>
          <BGContainer />
          <ContentContainer>
            <H3>Sign in to Giveth</H3>
            <ContentSubtitle>
              Please Sign in to your account and start using Giveth.
            </ContentSubtitle>
            <IconContentContainer>
              <EthIconContainer onClick={() => setShowWalletModal(true)}>
                <Image src={ethIcon} alt='Ether icon' />
                <B>Sign in with Ethereum</B>
              </EthIconContainer>
              <BreakPoint>
                <BreakLine />
                <P>or</P>
                <BreakLine />
              </BreakPoint>
              <SocialContentContainer>
                {socialArray.map(elem => (
                  <IconsContainer key={elem.alt} onClick={() => handleSocialConnection()}>
                    {' '}
                    {/* best way to activate torus here? */}
                    <Image src={elem.icon} alt={elem.alt} />
                  </IconsContainer>
                ))}
              </SocialContentContainer>
              <Image src={torusBrand} alt='Powered by Torus' />
            </IconContentContainer>
          </ContentContainer>
        </ModalGrid>
      </Modal>
    </>
  )
}

const CloseButton = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
  cursor: pointer;
`

const ModalGrid = styled.div`
  display: flex;
  height: 100%;
`

const BGContainer = styled.div`
  display: none;
  width: 55%;
  max-width: 640px;
  background-color: ${brandColors.giv[500]};
  background-image: url(images/sign_bg.svg);

  ${mediaQueries.lg} {
    display: block;
  }
`

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  margin: auto;

  ${mediaQueries.lg} {
    width: 45%;
  }
`

const ContentSubtitle = styled(P)`
  color: ${brandColors.deep[800]};
  margin: 24px 0;
`

const IconContentContainer = styled.div`
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
`

const IconsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 3px 16px;
  border-radius: 8px;
  box-shadow: ${Shadow.Neutral[500]};
  cursor: pointer;
`

const EthIconContainer = styled(IconsContainer)`
  padding: 20px 24px;
  border-radius: 4px;
`

const SocialContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`

const BreakPoint = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 48px 0;
`

const BreakLine = styled.hr`
  width: 45%;
  margin: auto 0;
  border-top: 1px solid ${neutralColors.gray[300]};
`

const customStyles = {
  content: {
    backgroundColor: 'white',
    color: brandColors.deep[900],
    maxWidth: '1440px',
    maxHeight: '840px',
    margin: 'auto',
    inset: 0,
    padding: 0,
    border: 'none'
  },
  overlay: {
    backgroundColor: 'rgb(9 4 70 / 70%)',
    zIndex: 1060
  }
}

const socialArray = [
  { icon: googleIcon, alt: 'Google icon.' },
  { icon: twitterIcon, alt: 'Twitter icon.' },
  { icon: facebookIcon, alt: 'Facebook icon.' },
  { icon: discordIcon, alt: 'Discord icon.' }
]

export default SignInModal
