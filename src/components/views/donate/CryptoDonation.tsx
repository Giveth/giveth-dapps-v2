import styled from 'styled-components'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import InputBox from '../../InputBox'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import UserContext from '../../../context/UserProvider'
import { formatEther, formatUnits } from '@ethersproject/units'
import { useQuery } from '@apollo/client'
import { FETCH_LISTED_TOKENS } from '../../../../src/apollo/gql/gqlEnums'
import { Button } from '../../styled-components/Button'
import { Caption, neutralColors, brandColors, GLink } from '@giveth/ui-design-system'
import WalletModal from '@/components/modals/WalletModal'
import DonateModal from '@/components/modals/DonateModal'
import { IProject } from '../../../apollo/types/types'
import {
  getERC20List,
  pollEvery,
  fetchPrices,
  fetchEthPrice,
  getERC20Info,
  switchToXdai
} from '../../../utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenAbi from 'human-standard-token-abi'

import TokenPicker from './TokenPicker'

const xdaiChain = { id: 100, name: 'xdai', mainToken: 'XDAI' }
const ethereumChain = { id: 1, name: 'ethereum', mainToken: 'ETH' }
const xdaiExcluded = ['PAN', 'XNODE', 'USDT', 'CRV']
const stableCoins = [xdaiChain.mainToken, 'DAI', 'USDT']
const GIVETH_DONATION_AMOUNT = 5
const POLL_DELAY_TOKENS = 5000

type SuccessFunction = (param: boolean) => void

interface ISelectObj {
  value: string
  label: string
  chainId?: number
  symbol?: string
  icon?: string
  address?: string
  ethereumAddress?: string
  decimals?: number
}

interface IToken {
  name: string
  chainId: number
  symbol: string
  icon?: string
}

const customStyles = {
  control: () => ({
    // match with the menu
    borderRadius: '0 !important',
    borderRightColor: 'transparent !important',
    padding: '8px 0 0 16px !important'
  }),
  menu: (base: any) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    // beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
    hyphens: 'auto',
    // kill the gap
    marginTop: 0,
    textAlign: 'left',
    // prevent menu to scroll y
    wordWrap: 'break-word',
    width: '280px'
  }),
  menuList: (base: any) => ({
    ...base,
    borderRadius: 0,
    // kill the white space on first and last option
    padding: 0
  }),
  singleValue: (base: any) => ({
    ...base,
    padding: 0
  })
}

const CryptoDonation = (props: { setSuccessDonation: SuccessFunction; project: IProject }) => {
  const context = useWeb3React()
  const { chainId: networkId, account, library: web3, deactivate } = context
  const userContext = UserContext()

  const {
    state: { isEnabled, user, balance },
    actions: { signIn }
  } = userContext
  const { project, setSuccessDonation } = props
  const { data: tokensList } = useQuery(FETCH_LISTED_TOKENS)

  const [tokens, setTokensObject] = useState<ISelectObj[]>()
  const [selectedToken, setSelectedToken] = useState<ISelectObj>()
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<any>()
  const [customInput, setCustomInput] = useState<any>()
  const [tokenPrice, setTokenPrice] = useState(1)
  const [mainTokenPrice, setMainTokenPrice] = useState(0)
  const [gasPrice, setGasPrice] = useState<number>()
  const [gasETHPrice, setGasETHPrice] = useState<number>()
  const [amountTyped, setAmountTyped] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [geminiModal, setGeminiModal] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [erc20List, setErc20List] = useState<any>()
  const [erc20OriginalList, setErc20OriginalList] = useState<any>()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [icon, setIcon] = useState(null)
  const [anonymous, setAnonymous] = useState(false)
  const [selectLoading, setSelectLoading] = useState(false)
  const [givBackEligible, setGivBackEligible] = useState(true)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const switchTraceable = false
  const donateToGiveth = false

  const tokenSymbol = selectedToken?.symbol
  const tokenAddress = selectedToken?.address
  const isXdai = networkId === xdaiChain.id
  const isGivingBlockProject = project?.givingBlocksId

  const stopPolling = useRef<any>(null)
  // Fetches initial main token price
  useEffect(() => {
    fetchEthPrice(setMainTokenPrice).then(setMainTokenPrice)
  }, [])

  // Checks network changes to fetch proper token list
  useEffect(() => {
    if (networkId) {
      let netId = networkId as Number | string
      if (isGivingBlockProject) netId = 'thegivingblock'
      if (isGivingBlockProject && networkId === 3) netId = 'ropsten_thegivingblock'
      let givIndex: number | undefined
      const erc20List: any = getERC20List(netId).tokens
      const tokens = erc20List.map((token: any, index: any) => {
        token.value = token
        token.label = token.symbol
        if (token.symbol === 'GIV' || token.symbol === 'TestGIV' || token.name === 'Giveth') {
          givIndex = index
        }
        return token
      })
      const givToken = givIndex && erc20List[givIndex]
      if (givToken && givIndex) {
        tokens.splice(givIndex, 1)
      }
      tokens?.sort((a: any, b: any) => {
        var tokenA = a.name.toUpperCase()
        var tokenB = b.name.toUpperCase()
        return tokenA < tokenB ? -1 : tokenA > tokenB ? 1 : 0
      })
      if (givToken) {
        tokens.splice(0, 0, givToken)
      }
      setErc20List(tokens)
      setErc20OriginalList(tokens)
      setSelectedToken(tokens[0])
    }
  }, [networkId])

  // Gets token list ready
  useEffect(() => {
    if (!tokensList) return
    setTokensObject(buildTokensObj(tokensList?.tokens, networkId))
  }, [tokensList])

  // Polls selected token data
  useEffect(() => {
    if (isEnabled) pollToken()
    return () => clearPoll()
  }, [selectedToken, isEnabled, account, networkId, balance])

  // Gets price of selected token
  useEffect(() => {
    if (selectedToken?.symbol && stableCoins.includes(selectedToken.symbol)) {
      setTokenPrice(1)
    } else if (selectedToken?.address && selectedToken.address) {
      let chain = xdaiChain.name
      let tokenAddress: string | undefined = selectedToken.address
      if (isXdai) {
        // coingecko doesn't have these tokens in xdai, so fetching price from ethereum
        if (xdaiExcluded.includes(selectedToken.symbol!)) {
          tokenAddress = selectedToken.ethereumAddress
          chain = ethereumChain.name
        }
      } else {
        chain = ethereumChain.name
      }
      fetchPrices(chain, tokenAddress, setTokenPrice).then(setTokenPrice)
    } else if (selectedToken?.symbol && selectedToken.symbol === ethereumChain.mainToken) {
      mainTokenPrice && setTokenPrice(mainTokenPrice)
    }
  }, [selectedToken, mainTokenPrice])

  // Gets GAS price
  useEffect(() => {
    web3?.getGasPrice().then((wei: any) => {
      const ethFromWei = formatEther(isXdai ? '1' : Number(wei))
      const gwei = isXdai ? 1 : formatUnits(wei, 'gwei')
      gwei && setGasPrice(Number(gwei))
      ethFromWei && setGasETHPrice(Number(ethFromWei) * 21000)
    })
  }, [networkId, selectedToken])

  const checkGIVTokenAvailability = () => {
    if (!isGivingBlockProject) return true
    if (selectedToken?.symbol === 'GIV') {
      setGeminiModal(true)
      return false
    } else {
      return true
    }
  }

  const buildTokensObj = (array: IToken[], chain: number | undefined) => {
    const newArray = [tokensList]
    array.forEach(e => {
      if (e.chainId !== chain) return
      const obj: ISelectObj = {
        label: e.symbol,
        value: e.symbol,
        chainId: e.chainId,
        icon: `/images/tokens/${e.symbol?.toLocaleLowerCase()}.png`
      }
      newArray.push(obj)
    })
    newArray.sort((a, b) => a.label.localeCompare(b.label))
    // setSelectedToken(newArray && newArray[0])
    return newArray
  }

  const clearPoll = () => {
    if (stopPolling.current) {
      stopPolling?.current()
      stopPolling.current = undefined
    }
  }
  const pollToken = useCallback(() => {
    clearPoll()
    // Native token balance is provided by the Web3Provider
    if (!selectedToken?.address) {
      return setSelectedTokenBalance(balance)
    }
    stopPolling.current = pollEvery(
      () => ({
        request: async () => {
          try {
            const instance = new Contract(selectedToken.address!, tokenAbi, web3)
            const a = await instance.balanceOf(account)
            return (await instance.balanceOf(account)) / 10 ** selectedToken.decimals!
          } catch (e) {
            return 0
          }
        },
        onResult: (_balance: any) => {
          if (
            _balance !== undefined &&
            (!selectedTokenBalance || selectedTokenBalance !== _balance)
          ) {
            setSelectedTokenBalance(_balance)
          }
        }
      }),
      POLL_DELAY_TOKENS
    )()
  }, [account, networkId, tokenSymbol, balance])

  const donation = parseFloat(amountTyped)
  const givethFee = Math.round((GIVETH_DONATION_AMOUNT * 100.0) / tokenPrice) / 100

  const mainTokenToUSD = (amountOfToken: any) => {
    const USDValue: any = (amountOfToken * mainTokenPrice).toFixed(2)
    if (USDValue > 0) {
      return `$${USDValue}`
    }
    return 'less than $0.01'
  }

  const donationTokenToUSD = (amountOfToken: any) => {
    const USDValue: any = (amountOfToken * tokenPrice).toFixed(2)
    if (isXdai) return ''
    if (USDValue > 0) {
      return `$${USDValue}`
    }
    return 'less than $0.01'
  }
  return (
    <>
      {showWalletModal && (
        <WalletModal showModal={showWalletModal} setShowModal={setShowWalletModal} />
      )}
      {showDonateModal && selectedToken && amountTyped && (
        <DonateModal
          showModal={showDonateModal}
          setShowModal={setShowDonateModal}
          project={project}
          token={selectedToken}
          userTokenBalance={selectedTokenBalance}
          amount={parseFloat(amountTyped)}
          price={tokenPrice}
          setTxHash={setTxHash}
          setInProgress={setInProgress}
          setUnconfirmed={setUnconfirmed}
          givBackEligible={givBackEligible}
        />
      )}
      {networkId !== xdaiChain.id && (
        <XDaiContainer>
          <div>
            <img src='/images/gas_station.svg' />
            <Caption color={neutralColors.gray[900]}>
              Save on gas fees, switch to xDAI network.
            </Caption>
            <Caption
              style={{ color: brandColors.pinky[500], marginLeft: '5px', cursor: 'pointer' }}
              onClick={switchToXdai}
            >
              Switch network
            </Caption>
          </div>
        </XDaiContainer>
      )}
      <SearchContainer>
        <DropdownContainer>
          <TokenPicker
            tokenList={erc20List}
            selectedToken={selectedToken}
            inputValue={customInput}
            onChange={(i: any) => {
              // setSelectedToken(i || selectedToken)
              setSelectedToken(i)
              // setIsComponentVisible(false)
              setCustomInput('')
              setErc20List(erc20OriginalList)
              let givBackEligibilty: any = erc20OriginalList?.find(
                (t: any) => t?.symbol === i?.symbol
              )
              if (i?.symbol?.toUpperCase() === 'ETH' || i?.symbol?.toUpperCase() === 'XDAI') {
                givBackEligibilty = true
              }
              setGivBackEligible(givBackEligibilty)
            }}
            onInputChange={(i: any) => {
              // It's a contract
              if (i?.length === 42) {
                try {
                  setSelectLoading(true)
                  getERC20Info({
                    library: web3,
                    tokenAbi,
                    contractAddress: i,
                    chainId: networkId
                  }).then(pastedToken => {
                    if (!pastedToken) return
                    const found = erc20List?.find((t: any) => t?.symbol === pastedToken?.symbol)
                    !found && setErc20List([...erc20List, pastedToken])
                    setCustomInput(pastedToken?.symbol)
                    setSelectLoading(false)
                  })
                } catch (error) {
                  setSelectLoading(false)
                }
              } else {
                setCustomInput(i)
                setErc20List([...erc20OriginalList])
              }
            }}
            placeholder={isGivingBlockProject ? 'Search name' : 'Search name or paste an address'}
          />
        </DropdownContainer>
        <SearchBarContainer>
          <InputBox
            onChange={a => {
              setShowDonateModal(false)
              setAmountTyped(a)
            }}
            placeholder='Amount'
          />
        </SearchBarContainer>
      </SearchContainer>
      <AvText>
        {' '}
        Available:{' '}
        {parseFloat(selectedTokenBalance || 0).toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
          } || ''
        )}{' '}
        {tokenSymbol}
      </AvText>
      <ButtonContainer>
        {isEnabled && (
          <Button
            small
            background={brandColors.giv[500]}
            width='100%'
            // onClick={() => setShowDonateModal(true)}
            onClick={() => setSuccessDonation(true)}
          >
            DONATE
          </Button>
        )}
        {!isEnabled && (
          <Button
            small
            background={brandColors.giv[500]}
            width='100%'
            onClick={() => setShowWalletModal(true)}
          >
            CONNECT WALLET
          </Button>
        )}
        {!!web3 && (
          <GLink
          // onClick={showWalletModal}
          >
            click here to use another wallet
          </GLink>
        )}
      </ButtonContainer>
    </>
  )
}

const Img = styled.img`
  margin-right: -10px;
  margin-top: 5px;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const AvText = styled(GLink)`
  color: ${brandColors.deep[500]};
  padding: 4px 0 0 5px;
`
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const DropdownContainer = styled.div`
  width: 35%;
  height: 54px;
`
const SearchBarContainer = styled.div`
  height: 54px;
  width: 65%;
  border: 2px solid ${neutralColors.gray[300]};
  border-radius: 0px 6px 6px 0px;
`
const XDaiContainer = styled.div`
  display: flex;
  flex: row;
  justify-content: space-between;
  padding: 8px 16px 18.5px 16px;
  margin: 24px 0 0 0;
  border-radius: 8px;
  div:first-child {
    display: flex;
    flex-direction: row;
    color: ${neutralColors.gray[800]};
    img {
      padding-right: 12px;
    }
  }
`
const ButtonContainer = styled.div`
  padding: 51px 0 0 0;
`

export default CryptoDonation
