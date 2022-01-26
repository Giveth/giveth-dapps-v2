import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injectedConnector } from '@/lib/wallet/walletTypes'

const useWallet = () => {
  const context = useWeb3React()
  const { connector } = context

  const [activatingConnector, setActivatingConnector] = useState()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const triedEager = useEagerConnect()

  useInactiveListener(!triedEager || !!activatingConnector)
}

const useEagerConnect = () => {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch(() => setTried(true))
      } else {
        setTried(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

const useInactiveListener = (suppress = false) => {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleActivate = () => activate(injectedConnector)

      ethereum.on('connect', handleActivate)
      ethereum.on('chainChanged', handleActivate)
      ethereum.on('accountsChanged', handleActivate)
      ethereum.on('networkChanged', handleActivate)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleActivate)
          ethereum.removeListener('chainChanged', handleActivate)
          ethereum.removeListener('accountsChanged', handleActivate)
          ethereum.removeListener('networkChanged', handleActivate)
        }
      }
    }
  }, [active, error, suppress, activate])
}

export default useWallet
