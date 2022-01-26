import React from 'react'
import Modal from 'react-modal'
import { TwitterShareButton } from 'react-share'
import { Button } from '../../styled-components/Button'
import { P } from '@giveth/ui-design-system'
import styled from 'styled-components'

const GeminiModal = ({ showModal, setShowModal }: any) => {
  const url = typeof window !== 'undefined' ? window?.location?.href : null
  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={customStyles}
        //   contentLabel={props?.contentLabel}
      >
        <div
          style={{
            display: showModal ? 'flex' : 'none',
            // position: 'absolute',
            // top: '15%',
            // right: [0, '15%', '25%'],
            zIndex: 5,
            alignItems: 'center',
            padding: '3% 0',
            flexDirection: 'column',
            width: '600px',
            borderRadius: '2px'
          }}
        >
          <XButton
            onClick={() => {
              setShowModal(false)
            }}
          >
            <img src='/images/x-icon.svg' alt='exit' style={{ width: '100%', height: '100%' }} />
          </XButton>
          <P
            style={{
              marginTop: 3,
              textAlign: 'center',
              fontSize: '20px'
            }}
          >
            Giving Block projects only accept donations listed on Gemini
          </P>
          <P
            style={{
              marginBottom: 4,
              textAlign: 'center',
              fontSize: '20px'
            }}
          >
            Help us get GIV on Gemini!{' '}
          </P>
          <img src='/images/twitter-modal.svg' alt='tw-modal' style={{ margin: '15px 0' }} />
          <Button
            style={{
              marginTop: 4,
              color: 'white',
              width: '240px',
              height: '52px',
              border: '2px solid #AAAFCA',
              backgroundColor: '#00ACEE'
            }}
          >
            <TwitterShareButton
              beforeOnClick={() => setShowModal(false)}
              title={
                'Hey @gemini - I want to donate $GIV to this @thegivingblock project on @givethio! Help me support them by listing $GIV on gemini.com @tyler @cameron'
              }
              url={url!}
              hashtags={['gemini', 'giveth', 'giv', 'donation']}
            >
              {' '}
              <a style={{ display: 'flex', justifyContent: 'center' }}>
                TWEET NOW{' '}
                <img
                  src='/images/tw-icon.svg'
                  style={{ marginLeft: '6px' }}
                  alt='tweet-now'
                  width='15px'
                  height='15px'
                />
              </a>
            </TwitterShareButton>
          </Button>
          <P
            onClick={() => {
              setShowModal(false)
            }}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#A3B0F6',
              marginTop: '12px'
            }}
          >
            CANCEL
          </P>
        </div>
      </Modal>
    </>
  )
}

const XButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  fontsize: 3;
  color: secondary;
  cursor: pointer;
`

const customStyles = {
  content: {
    zIndex: 40,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    borderRadius: '12px',
    borderColor: 'transparent',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    zIndex: 40,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(83, 38, 236, 0.2)'
  }
}

export default GeminiModal
