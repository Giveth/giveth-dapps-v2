import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Image from 'next/image'
import { brandColors, H3, H6, P, B, neutralColors } from '@giveth/ui-design-system'
import { IModal, Modal } from '@/components/modals/Modal'
import { IProject } from '../../apollo/types/types'
import { Row } from '../styled-components/Grid'
import { Button } from '../styled-components/Button'
import { TailSpin } from 'react-loader-spinner'
import styled from 'styled-components'

interface IToken {
  value: string
  label: string
  chainId?: number
  symbol?: string
  icon?: string
  address?: string
}

interface IDonateModal extends IModal {
  closeParentModal?: () => void
  project: IProject
  token: IToken
  amount: Number
  price?: Number
}

const DonateModal = ({
  showModal,
  setShowModal,
  closeParentModal,
  project,
  token,
  amount,
  price
}: IDonateModal) => {
  const context = useWeb3React()
  const { activate } = context

  const [donating, setDonating] = useState(false)
  if (!showModal) return null

  const avgPrice = price && price * amount

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <DonateContainer>
        <DonateTopTitle>
          <Image src='/images/wallet_icon.svg' width='32px' height='32px' />
          <H6>Donating</H6>
        </DonateTopTitle>
        <DonatingBox>
          <P>You are donating</P>
          <H3>
            {amount} {token.symbol}
          </H3>
          {avgPrice && <H6>{parseFloat(String(avgPrice)).toLocaleString('en-US')} USD </H6>}
          <div style={{ margin: ' 22px 0 59px 0' }}>
            <P>
              To <B style={{ marginLeft: '6px' }}>{project.title}</B>
            </P>
          </div>
        </DonatingBox>
        <DonateButton
          style={{
            borderColor: 'transparent',
            backgroundColor: donating ? brandColors.giv[200] : brandColors.giv[500]
          }}
          onClick={() => setDonating(!donating)}
        >
          <Row>
            {donating && <TailSpin color='white' height={32} width={32} />}
            {donating ? <P>DONATING</P> : <P>DONATE</P>}
          </Row>
        </DonateButton>
      </DonateContainer>
    </Modal>
  )
}

const DonateContainer = styled.div`
  width: 494px;
  background: white;
  color: black;
  padding: 0 24px 38px 24px;
`

const DonateTopTitle = styled(Row)`
  gap: 14px;
  h6 {
    padding: 24px 0;
    font-weight: bold;
    color: ${neutralColors.gray[900]};
  }
`

const DonatingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${brandColors.deep[900]};
  h6 {
    color: ${neutralColors.gray[700]};
  }
  div:last-child {
    display: flex;
    flex-direction: row;
  }
`

const DonateButton = styled(Button)`
  display: flex;
  justify-content: center;
  algin-items: center;
  * {
    margin: auto 0;
    padding: 0 8px 0 0;
    font-weight: bold;
  }
`

export default DonateModal
