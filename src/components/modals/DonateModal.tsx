import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import UserContext from '../../context/UserProvider'
import Image from 'next/image'
import { brandColors, H3, H6, P, B, neutralColors } from '@giveth/ui-design-system'
import { IModal, Modal } from '@/components/modals/Modal'
import { IProject } from '../../apollo/types/types'
import { Row } from '../styled-components/Grid'
import { Button } from '../styled-components/Button'
import { TailSpin } from 'react-loader-spinner'
import Logger from '../../utils/Logger'
import { checkNetwork } from '../../utils'
import { isAddressENS, getAddressFromENS } from '../../lib/wallet'
import { sendTransaction } from '../../lib/helpers'
import * as transaction from '../../services/transaction'
import { saveDonation, saveDonationTransaction } from '../../services/donation'
import config from '../../../config'
import styled from 'styled-components'

const xdaiChain = { id: 100, name: 'xdai', mainToken: 'XDAI' }

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
  amount: number
  price?: number
  userTokenBalance?: number
  anonymous?: boolean
  setInProgress?: any
  setUnconfirmed?: any
  setSuccessDonation?: any
  givBackEligible?: boolean
}

const DonateModal = ({
  showModal,
  setShowModal,
  closeParentModal,
  project,
  token,
  userTokenBalance,
  amount,
  price,
  anonymous,
  setInProgress,
  setSuccessDonation,
  setUnconfirmed,
  givBackEligible
}: IDonateModal) => {
  const context = useWeb3React()
  const { account, library: web3, chainId: networkId } = context
  const userContext = UserContext()
  const {
    state: { user },
    actions: { signIn }
  } = userContext
  const [donating, setDonating] = useState(false)
  if (!showModal) return null

  const avgPrice = price && price * amount
  const isGivingBlockProject = project?.givingBlocksId
  const isXdai = networkId === xdaiChain.id

  const confirmDonation = async () => {
    try {
      // Traceable by default if it comes from Trace only
      // Depends on the toggle if it's an IO to Trace project
      // let traceable = project?.fromTrace
      //   ? true
      //   : isTraceable
      //   ? isTraceable
      //   : switchTraceable
      let traceable = false
      let userToken: any = user?.token
      // Sign message for registered users to get user info, no need to sign for anonymous
      if (!userToken) {
        const tokenFromSignin = signIn && (await signIn())
        if (!tokenFromSignin) return
        userToken = tokenFromSignin
      }
      if (!project?.walletAddress) {
        // return Toast({
        //   content: 'There is no eth address assigned for this project',
        //   type: 'error'
        // })
        // TODO: SET RIGHT MODAL
        alert('There is no eth address assigned for this project')
      }

      const isCorrectNetwork = checkNetwork(networkId)
      if (isGivingBlockProject && networkId !== config.PRIMARY_NETWORK.id)
        // return triggerPopup('WrongNetwork', networkId)
        // TODO: SET RIGHT MODAL
        return alert('wrong network')
      if (!isCorrectNetwork) {
        // TODO: SET RIGHT MODAL
        // return triggerPopup('WrongNetwork')
        return alert('wrong network')
      }

      if (!amount || amount <= 0) {
        // TODO: SET RIGHT MODAL
        // return Toast({ content: 'Please set an amount', type: 'warn' })
        alert('Please set an amount')
      }

      if (userTokenBalance! < amount) {
        // return triggerPopup('InsufficientFunds')
        // TODO: SET RIGHT MODAL
        return alert('Insufficient Funds')
      }

      // Toast({
      //   content: 'Donation in progress...',
      //   type: 'dark',
      //   customPosition: 'top-left',
      //   isLoading: true,
      //   noAutoClose: true
      // })
      const toAddress = isAddressENS(project.walletAddress!)
        ? await getAddressFromENS(project.walletAddress!, web3)
        : project.walletAddress
      const web3Provider = web3
      await transaction.send(
        web3,
        toAddress,
        token.address!,
        amount,
        sendTransaction,
        {
          onTransactionHash: async (transactionHash: any) => {
            // Save initial txn details to db
            const { donationId, savedDonation, saveDonationErrors } = await saveDonation(
              account!,
              toAddress,
              transactionHash,
              networkId!,
              Number(amount),
              token.symbol!,
              Number(project.id),
              token.address!,
              anonymous!
            )
            console.log('DONATION RESPONSE: ', {
              donationId,
              savedDonation,
              saveDonationErrors
            })
            // onTransactionHash callback for event emitter
            transaction.confirmEtherTransaction(
              transactionHash,
              (res: any) => {
                try {
                  console.log({ res })
                  if (!res) return
                  // toast.dismiss()
                  if (res?.tooSlow === true) {
                    // Tx is being too slow
                    // toast.dismiss()
                    setSuccessDonation({
                      transactionHash,
                      tokenSymbol: token.symbol,
                      subtotal: amount,
                      givBackEligible,
                      tooSlow: true
                    })
                    setInProgress(true)
                  } else if (res?.status) {
                    // Tx was successful
                    // toast.dismiss()
                    setSuccessDonation({
                      transactionHash,
                      tokenSymbol: token.symbol,
                      subtotal: amount,
                      givBackEligible
                    })
                    setUnconfirmed(false)
                  } else {
                    // EVM reverted the transaction, it failed
                    setSuccessDonation({
                      transactionHash,
                      tokenSymbol: token.symbol,
                      subtotal: amount,
                      givBackEligible
                    })
                    setUnconfirmed(true)
                    if (res?.error) {
                      // Toast({
                      //   content: res?.error?.message,
                      //   type: 'error'
                      // })
                      // TODO
                      alert(res?.error?.message)
                    } else {
                      // Toast({
                      //   content: `Transaction couldn't be confirmed or it failed`,
                      //   type: 'error'
                      // })
                      // TODO
                      alert("Transaction couldn't be confirmed or it failed")
                    }
                  }
                } catch (error) {
                  Logger.captureException(error)
                  console.log({ error })
                  // toast.dismiss()
                }
              },
              0,
              isXdai,
              web3
            )
            await saveDonationTransaction(transactionHash, donationId)
          },
          onReceiptGenerated: (receipt: any) => {
            console.log({ receipt })
            setSuccessDonation({
              transactionHash: receipt?.transactionHash,
              tokenSymbol: token.symbol,
              subtotal: amount
            })
          },
          onError: (error: any) => {
            console.log({ error })
            // toast.dismiss()
            // the outside catch handles any error here
            // Toast({
            //   content: error?.error?.message || error?.message || error,
            //   type: 'error'
            // })
          }
        },
        traceable
      )

      // Commented notify and instead we are using our own service
      // transaction.notify(transactionHash)
    } catch (error: any) {
      // toast.dismiss()
      console.log({ error })
      setDonating(false)
      Logger.captureException(error)
      if (
        error?.data?.code === 'INSUFFICIENT_FUNDS' ||
        error?.data?.code === 'UNPREDICTABLE_GAS_LIMIT'
      ) {
        // TODO: change this to custom alert
        // return triggerPopup('InsufficientFunds')
        alert('Insufficient Funds')
      }
      // return Toast({
      //   content:
      //     error?.data?.data?.message ||
      //     error?.data?.message ||
      //     error?.error?.message ||
      //     error?.message ||
      //     error,
      //   type: 'error'
      // })
      alert(JSON.stringify(error))
    }
  }

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
          <div style={{ margin: '12px 0 32px 0' }}>
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
          onClick={() => {
            setDonating(!donating)
            confirmDonation()
          }}
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
  div:first-child {
    margin-bottom: 8px;
  }
  h3 {
    margin-top: -5px;
  }
  h6 {
    color: ${neutralColors.gray[700]};
    margin-top: -5px;
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
