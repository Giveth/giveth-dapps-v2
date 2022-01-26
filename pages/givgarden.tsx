import GIVgardenView from '@/components/views/Garden.view'
import { useGeneral, ETheme } from '@/context/general.context'
import Head from 'next/head'
import { useEffect } from 'react'

export default function GIVgardenRoute() {
  const { setTheme } = useGeneral()

  useEffect(() => {
    setTheme(ETheme.Dark)
    return () => {
      setTheme(ETheme.Light)
    }
  }, [setTheme])
  return (
    <>
      <Head>
        <title>GIVgarden</title>
      </Head>
      <GIVgardenView />
    </>
  )
}
